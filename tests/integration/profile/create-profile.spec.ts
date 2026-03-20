import request from 'supertest';

import OutboxEvent from '../../../src/shared/entities/outbox-event.entity';
import Profile from '../../../src/features/profile/entities/profile.entity';
import {
	buildTestApp,
	clearDatabase,
	destroyTestDataSource,
	initializeTestDataSource,
} from '../../helpers/test-helpers';
import TestDataSource from '../../../src/shared/infrastructure/database/data-source-test';

describe('Integration: POST /profiles', () => {
	beforeAll(async () => {
		await initializeTestDataSource();
	});

	beforeEach(async () => {
		await clearDatabase();
	});

	afterAll(async () => {
		await destroyTestDataSource();
	});

	it('creates a profile and replays the same idempotent request', async () => {
		const app = buildTestApp();
		const payload = {
			externalId: 'profile-001',
			displayName: 'Alpha',
			email: 'alpha@example.com',
			entityType: 'individual',
		};

		const response = await request(app)
			.post('/profiles')
			.set('X-Idempotency-Key', 'create-key')
			.set('X-Correlation-ID', '0ca30ca2-86cb-4b6f-9f25-7d9b99197cea')
			.send(payload);

		expect(response.status).toBe(201);
		expect(response.body.profileId).toBeDefined();
		expect(response.headers['x-correlation-id']).toBe('0ca30ca2-86cb-4b6f-9f25-7d9b99197cea');

		const replay = await request(app)
			.post('/profiles')
			.set('X-Idempotency-Key', 'create-key')
			.set('X-Correlation-ID', '0ca30ca2-86cb-4b6f-9f25-7d9b99197cea')
			.send(payload);

		expect(replay.status).toBe(201);
		expect(replay.body).toEqual(response.body);
		expect(replay.headers['idempotency-replayed']).toBe('true');

		const profiles = await TestDataSource.getRepository(Profile).find();
		const outboxEvents = await TestDataSource.getRepository(OutboxEvent).find();

		expect(profiles).toHaveLength(1);
		expect(outboxEvents).toHaveLength(1);
	});

	it('returns 409 when the same key is reused with a different body', async () => {
		const app = buildTestApp();

		await request(app)
			.post('/profiles')
			.set('X-Idempotency-Key', 'create-key')
			.set('X-Correlation-ID', '0ca30ca2-86cb-4b6f-9f25-7d9b99197cea')
			.send({
				externalId: 'profile-001',
				displayName: 'Alpha',
				email: 'alpha@example.com',
				entityType: 'individual',
			});

		const response = await request(app)
			.post('/profiles')
			.set('X-Idempotency-Key', 'create-key')
			.set('X-Correlation-ID', '0ca30ca2-86cb-4b6f-9f25-7d9b99197cea')
			.send({
				externalId: 'profile-002',
				displayName: 'Beta',
				email: 'beta@example.com',
				entityType: 'organization',
			});

		expect(response.status).toBe(409);
		expect(response.body.message).toBe('conflict');
	});
});
