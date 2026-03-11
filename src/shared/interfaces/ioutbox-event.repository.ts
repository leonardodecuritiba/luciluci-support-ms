import OutboxEvent from '../entities/outbox-event.entity';

export default interface IOutboxEventRepository {
	save(event: OutboxEvent): Promise<OutboxEvent>;
	findPending(limit: number): Promise<OutboxEvent[]>;
	markProcessed(id: string): Promise<void>;
	markFailed(id: string, errorMessage: string): Promise<void>;
}
