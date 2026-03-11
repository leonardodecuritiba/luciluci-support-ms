import AppDataSource from './shared/infrastructure/database/data-source';
import logger from './shared/infrastructure/logger';
import { env } from './shared/utils/env';
import { retry } from './shared/utils/retry';
import createApp from './app';
import RabbitMQService from './shared/infrastructure/rabbitmq/rabbitmq.service';
import ClassificationAssignedConsumer from './features/profile/adapters/consumers/classification-assigned.consumer';
import OutboxEventTypeormRepository from './shared/adapters/repositories/outbox-event-typeorm.repository';
import OutboxEventPublisherWorker from './shared/adapters/workers/outbox-event-publisher.worker';

async function bootstrap(): Promise<void> {
	await retry(() => AppDataSource.initialize(), 10, 3000);

	const rabbitMqService = new RabbitMQService();
	await retry(() => rabbitMqService.connect(), 10, 3000);

	const outboxWorker = new OutboxEventPublisherWorker(
		new OutboxEventTypeormRepository(AppDataSource.manager),
		rabbitMqService,
		env.outbox.pollIntervalMs,
		env.outbox.batchSize,
	);
	outboxWorker.start();

	const classificationConsumer = new ClassificationAssignedConsumer(AppDataSource);
	await rabbitMqService.consume(
		'standard-ms.classification.assigned.v1',
		env.rabbitmq.classificationExchange,
		'classifications.classification.assigned.v1',
		(message, channel) => classificationConsumer.handle(message, channel),
	);

	const app = createApp(AppDataSource, rabbitMqService);

	app.listen(env.serverPort, () => {
		logger.info({ port: env.serverPort }, 'standard-ms is running.');
	});
}

bootstrap().catch((error) => {
	logger.error({ err: error }, 'Failed to bootstrap standard-ms.');
	process.exit(1);
});
