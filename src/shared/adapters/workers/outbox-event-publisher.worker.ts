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
				const correlationId = this.resolveCorrelationId(event);

				await this.rabbitMqService.publish({
					exchange: event.exchange,
					routingKey: event.topic,
					payload: event.payload,
					messageId: String(event.payload.eventId),
					correlationId,
					headers: event.headers ?? undefined,
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

	private resolveCorrelationId(event: {
		headers?: Record<string, unknown> | null;
		payload: Record<string, unknown>;
	}): string {
		const headerValue = event.headers?.['X-Correlation-ID'];

		if (typeof headerValue === 'string' && headerValue.length > 0) {
			return headerValue;
		}

		return String(event.payload.correlationId);
	}
}
