import { EntitySchema } from 'typeorm';

import OutboxEvent from '../../../entities/outbox-event.entity';

const OutboxEventSchema = new EntitySchema<OutboxEvent>({
	name: 'OutboxEvent',
	target: OutboxEvent,
	tableName: 'outbox_events',
	columns: {
		id: {
			type: String,
			primary: true,
			generated: 'uuid',
		},
		aggregateType: {
			name: 'aggregate_type',
			type: String,
		},
		aggregateId: {
			name: 'aggregate_id',
			type: String,
		},
		topic: {
			type: String,
		},
		eventType: {
			name: 'event_type',
			type: String,
		},
		exchange: {
			type: String,
		},
		routingKey: {
			name: 'routing_key',
			type: String,
		},
		payload: {
			type: 'simple-json',
		},
		headers: {
			type: 'simple-json',
			nullable: true,
		},
		attempts: {
			type: Number,
			default: 0,
		},
		lastError: {
			name: 'last_error',
			type: String,
			nullable: true,
		},
		occurredAt: {
			name: 'occurred_at',
			type: Date,
			createDate: false,
		},
		publishedAt: {
			name: 'published_at',
			type: Date,
			nullable: true,
		},
		processedAt: {
			name: 'processed_at',
			type: Date,
			nullable: true,
		},
		createdAt: {
			name: 'created_at',
			type: Date,
			createDate: true,
		},
		updatedAt: {
			name: 'updated_at',
			type: Date,
			updateDate: true,
		},
	},
});

export default OutboxEventSchema;
