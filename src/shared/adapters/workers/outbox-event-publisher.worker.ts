import logger from '../../infrastructure/logger';
import RabbitMQService from '../../infrastructure/rabbitmq/rabbitmq.service';
import IOutboxEventRepository from '../../interfaces/ioutbox-event.repository';

export default class OutboxEventPublisherWorker {
  private timer?: NodeJS.Timeout;

  constructor(
    private readonly outboxRepository: IOutboxEventRepository,
    private readonly rabbitMqService: RabbitMQService,
    private readonly pollIntervalMs: number,
    private readonly batchSize: number,
  ) {}

  start(): void {
    if (this.timer) {
      return;
    }

    this.timer = setInterval(() => {
      this.publishPending().catch((error) => {
        logger.error({ err: error }, 'Outbox worker iteration failed.');
      });
    }, this.pollIntervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  async publishPending(): Promise<void> {
    const events = await this.outboxRepository.findPending(this.batchSize);

    for (const event of events) {
      try {
        await this.rabbitMqService.publish({
          exchange: event.exchange,
          routingKey: event.routingKey,
          payload: event.payload,
          messageId: String(event.payload.eventId),
          correlationId: String(event.payload.correlationId),
        });

        await this.outboxRepository.markProcessed(event.id);
      } catch (error) {
        await this.outboxRepository.markFailed(
          event.id,
          error instanceof Error ? error.message : 'Unknown outbox publish error',
        );
      }
    }
  }
}

