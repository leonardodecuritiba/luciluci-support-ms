import request from 'supertest';

import OutboxEventTypeormRepository from '../../../src/shared/adapters/repositories/outbox-event-typeorm.repository';
import OutboxEventPublisherWorker from '../../../src/shared/adapters/workers/outbox-event-publisher.worker';
import RabbitMQService from '../../../src/shared/infrastructure/rabbitmq/rabbitmq.service';
import TestDataSource from '../../../src/shared/infrastructure/database/data-source-test';
import IdempotencyState from '../../../src/shared/entities/enums/idempotency-state.enum';
import { env } from '../../../src/shared/utils/env';
import {
	buildTestApp,
	clearDatabase,
	destroyTestDataSource,
	initializeTestDataSource,
} from '../../helpers/test-helpers';
import { createRabbitMqTestConsumer } from '../../helpers/rabbitmq-test-helpers';

const PROFILE_CREATED_TOPIC = 'profiles.profile.created.v1';
const CORRELATION_ID = '14c4a3d1-cb85-4e35-952b-d44e1aa0c665';
const PROFILE_IDEMPOTENCY_KEY = 'profile-create-rabbitmq-e2e';

describe('Integration: outbox publisher with RabbitMQ', () => {
	beforeAll(async () => {
		await initializeTestDataSource();
	});

	beforeEach(async () => {
		await clearDatabase();
	});

	afterAll(async () => {
		await destroyTestDataSource();
	});

	it('publishes profiles.profile.created.v1 through the real app, outbox worker and RabbitMQ', async () => {
		const app = buildTestApp();
		const rabbitConsumer = await createRabbitMqTestConsumer(PROFILE_CREATED_TOPIC);
		const rabbitMqService = new RabbitMQService();

		try {
			const createResponse = await request(app)
				.post('/profiles')
				.set('X-Idempotency-Key', PROFILE_IDEMPOTENCY_KEY)
				.set('X-Correlation-ID', CORRELATION_ID)
				.send({
					externalId: 'profile-001',
					displayName: 'Alpha',
					email: 'alpha@example.com',
					entityType: 'individual',
				});

			expect(createResponse.status).toBe(201);
			expect(createResponse.headers['x-correlation-id']).toBe(CORRELATION_ID);
			expect(createResponse.body).toEqual(
				expect.objectContaining({
					profileId: expect.any(String),
				}),
			);

			const profileId = createResponse.body.profileId as string;
			const auditLog = await findAuditLogByResourceId(profileId);
			const idempotencyRecord = await findIdempotencyRecord(PROFILE_IDEMPOTENCY_KEY);
			const parsedResponseBody = JSON.parse(idempotencyRecord.response_body as string);
			const pendingEvent = await findOutboxEventByAggregateId(profileId);

			expect(auditLog).toMatchObject({
				action: 'profile.created',
				resource_type: 'profile',
				resource_id: profileId,
				correlation_id: CORRELATION_ID,
			});

			expect(idempotencyRecord).toMatchObject({
				key: PROFILE_IDEMPOTENCY_KEY,
				state: IdempotencyState.Completed,
				response_status: 201,
				correlation_id: CORRELATION_ID,
			});
			expect(parsedResponseBody).toEqual(
				expect.objectContaining({
					profileId,
				}),
			);

			expect(pendingEvent).toMatchObject({
				aggregate_id: profileId,
				topic: PROFILE_CREATED_TOPIC,
				exchange: env.rabbitmq.profileExchange,
				routing_key: PROFILE_CREATED_TOPIC,
				headers: {
					'X-Correlation-ID': CORRELATION_ID,
				},
				published_at: null,
				processed_at: null,
				last_error: null,
			});

			expect(pendingEvent.payload).toEqual(
				expect.objectContaining({
					eventId: expect.any(String),
					correlationId: CORRELATION_ID,
					profileId,
					externalId: 'profile-001',
					entityType: 'individual',
					email: 'alpha@example.com',
				}),
			);

			await rabbitMqService.connect();
			const outboxWorker = new OutboxEventPublisherWorker(
				new OutboxEventTypeormRepository(TestDataSource.manager),
				rabbitMqService,
				env.outbox.pollIntervalMs,
				env.outbox.batchSize,
			);

			const messagePromise = rabbitConsumer.waitForMessage();
			await outboxWorker.publishPending();
			const message = await messagePromise;
			const deliveredPayload = JSON.parse(message.content.toString('utf8')) as Record<
				string,
				unknown
			>;

			expect(message.fields.routingKey).toBe(PROFILE_CREATED_TOPIC);
			expect(message.properties.messageId).toBe(String(pendingEvent.payload.eventId));
			expect(message.properties.correlationId).toBe(CORRELATION_ID);
			expect(message.properties.contentType).toBe('application/json');
			expect(message.properties.headers).toMatchObject({
				'X-Correlation-ID': CORRELATION_ID,
			});
			expect(deliveredPayload).toEqual(
				expect.objectContaining({
					eventId: pendingEvent.payload.eventId,
					correlationId: CORRELATION_ID,
					profileId,
					externalId: 'profile-001',
					entityType: 'individual',
					email: 'alpha@example.com',
				}),
			);

			const processedEvent = await findOutboxEventById(pendingEvent.id);
			const pendingEvents = await new OutboxEventTypeormRepository(
				TestDataSource.manager,
			).findPending(10);

			expect(processedEvent).toMatchObject({
				id: pendingEvent.id,
				published_at: expect.any(Date),
				processed_at: expect.any(Date),
				last_error: null,
			});
			expect(pendingEvents).toHaveLength(0);
		} finally {
			await rabbitMqService.close().catch(() => undefined);
			await rabbitConsumer.close();
		}
	});
});

async function findAuditLogByResourceId(resourceId: string) {
	const [row] = await TestDataSource.query(
		`
			SELECT action, resource_type, resource_id, correlation_id, performed_by, performed_by_type
			FROM audit_logs
			WHERE resource_id = $1
			ORDER BY created_at DESC
			LIMIT 1
		`,
		[resourceId],
	);
	return row;
}

async function findIdempotencyRecord(key: string) {
	const [row] = await TestDataSource.query(
		`
			SELECT key, state, response_status, response_body, correlation_id
			FROM idempotency_keys
			WHERE key = $1
		`,
		[key],
	);
	return row;
}

async function findOutboxEventByAggregateId(aggregateId: string) {
	const [row] = await TestDataSource.query(
		`
			SELECT id, aggregate_id, topic, exchange, routing_key, payload, headers, published_at, processed_at, last_error
			FROM outbox_events
			WHERE aggregate_id = $1
			ORDER BY occurred_at DESC
			LIMIT 1
		`,
		[aggregateId],
	);

	if (row) {
		if (row.payload) {
			row.payload = JSON.parse(row.payload as string);
		}
		if (row.headers) {
			row.headers = JSON.parse(row.headers as string);
		}
	}

	return row;
}

async function findOutboxEventById(id: string) {
	const [row] = await TestDataSource.query(
		'SELECT id, published_at, processed_at, last_error FROM outbox_events WHERE id = $1',
		[id],
	);

	return row
		? {
				...row,
				published_at: row.published_at ? new Date(row.published_at) : null,
				processed_at: row.processed_at ? new Date(row.processed_at) : null,
			}
		: null;
}
