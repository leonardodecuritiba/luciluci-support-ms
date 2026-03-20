export default class OutboxEvent {
	id!: string;
	aggregateType!: string;
	aggregateId!: string;
	topic!: string;
	eventType!: string;
	exchange!: string;
	routingKey!: string;
	payload!: Record<string, unknown>;
	headers?: Record<string, unknown> | null;
	attempts = 0;
	lastError?: string | null;
	occurredAt!: Date;
	publishedAt?: Date | null;
	processedAt?: Date | null;
	createdAt!: Date;
	updatedAt!: Date;
}
