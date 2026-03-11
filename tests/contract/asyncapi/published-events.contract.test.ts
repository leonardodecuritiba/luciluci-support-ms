import {
	validateEventPayload,
	validateRabbitMQHeaders,
} from '../../helpers/asyncapi-validator.helper';
import { eventSchemaRegistry } from '../../../src/shared/infrastructure/events/event-schema-registry';

describe('Contract: AsyncAPI published events', () => {
	it('validates a valid profiles.profile.created.v1 payload', () => {
		const validation = validateEventPayload('profiles.profile.created.v1', {
			eventId: 'e9900f10-3d6a-4b86-876c-bde52e38d83d',
			correlationId: 'd4f768ca-c426-4019-9282-be1dd2644990',
			occurredAt: new Date().toISOString(),
			profileId: 'f0d0c4aa-dc89-492f-816f-23688ee4ca98',
			externalId: 'profile-001',
			status: 'active',
			entityType: 'individual',
			email: 'alpha@example.com',
		});

		expect(validation.valid).toBe(true);
	});

	it('rejects an invalid profiles.profile.updated.v1 payload', () => {
		const validation = validateEventPayload('profiles.profile.updated.v1', {
			eventId: 'not-a-uuid',
			correlationId: 'd4f768ca-c426-4019-9282-be1dd2644990',
			occurredAt: new Date().toISOString(),
			profileId: 'f0d0c4aa-dc89-492f-816f-23688ee4ca98',
			externalId: 'profile-001',
			changedFields: 'displayName',
			status: 'active',
			entityType: 'individual',
			email: 'alpha@example.com',
		} as unknown as Record<string, unknown>);

		expect(validation.valid).toBe(false);
	});

	it('validates RabbitMQ headers', () => {
		const result = validateRabbitMQHeaders({
			messageId: 'message-1',
			correlationId: '83ca0fa7-8ce4-45ef-9a66-2ef70a0f11fd',
		});

		expect(result.valid).toBe(true);
	});

	it('exposes the published schemas in the registry', () => {
		expect(eventSchemaRegistry.getPublishedEvents()).toHaveLength(2);
	});
});
