import OutboxEvent from '../../../../src/shared/entities/outbox-event.entity';
import IOutboxEventRepository from '../../../../src/shared/interfaces/ioutbox-event.repository';

export default class FakeOutboxRepository implements IOutboxEventRepository {
  items: OutboxEvent[] = [];

  async save(event: OutboxEvent): Promise<OutboxEvent> {
    event.id = event.id || `${this.items.length + 1}`;
    this.items.push(event);
    return event;
  }

  async findPending(limit: number): Promise<OutboxEvent[]> {
    return this.items.filter((item) => !item.processedAt).slice(0, limit);
  }

  async markProcessed(id: string): Promise<void> {
    const event = this.items.find((item) => item.id === id);

    if (event) {
      event.processedAt = new Date();
      event.lastError = null;
    }
  }

  async markFailed(id: string, errorMessage: string): Promise<void> {
    const event = this.items.find((item) => item.id === id);

    if (event) {
      event.attempts += 1;
      event.lastError = errorMessage;
    }
  }
}

