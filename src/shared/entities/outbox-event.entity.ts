export default class OutboxEvent {
  id!: string;
  aggregateType!: string;
  aggregateId!: string;
  eventType!: string;
  exchange!: string;
  routingKey!: string;
  payload!: Record<string, unknown>;
  attempts = 0;
  lastError?: string | null;
  occurredAt!: Date;
  processedAt?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}

