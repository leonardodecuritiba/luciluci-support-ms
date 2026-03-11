import { validateEventPayload } from '../../helpers/asyncapi-validator.helper';
import { eventSchemaRegistry } from '../../../src/shared/infrastructure/events/event-schema-registry';

describe('Contract: AsyncAPI consumed events', () => {
	it('validates a valid classifications.classification.assigned.v1 payload', () => {
		const validation = validateEventPayload('classifications.classification.assigned.v1', {
			eventId: '190dd4e9-3f1b-4801-a9e0-f3588187a98a',
			correlationId: '709632ea-6114-43b0-b890-386d87f960d5',
			profileId: 'f0d0c4aa-dc89-492f-816f-23688ee4ca98',
			classificationId: 'class-gold',
			classificationName: 'Gold',
			occurredAt: new Date().toISOString(),
		});

		expect(validation.valid).toBe(true);
	});

	it('rejects an invalid consumed payload', () => {
		const validation = validateEventPayload('classifications.classification.assigned.v1', {
			eventId: '190dd4e9-3f1b-4801-a9e0-f3588187a98a',
			profileId: 'f0d0c4aa-dc89-492f-816f-23688ee4ca98',
			classificationId: 123,
			classificationName: 'Gold',
			occurredAt: new Date().toISOString(),
		} as unknown as Record<string, unknown>);

		expect(validation.valid).toBe(false);
	});

	it('exposes the consumed schemas in the registry', () => {
		expect(eventSchemaRegistry.getConsumedEvents()).toHaveLength(1);
	});
});
