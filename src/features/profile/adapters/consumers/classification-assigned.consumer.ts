import { randomUUID } from 'node:crypto';
import { Channel, ConsumeMessage } from 'amqplib';
import { DataSource } from 'typeorm';

import AuditLogTypeormRepository from '../../../../shared/adapters/repositories/audit-log-typeorm.repository';
import ProcessedMessageTypeormRepository from '../../../../shared/adapters/repositories/processed-message-typeorm.repository';
import logger from '../../../../shared/infrastructure/logger';
import ProcessedMessage from '../../../../shared/entities/processed-message.entity';
import ProfileTypeormRepository from '../repositories/profile-typeorm.repository';
import ProcessClassificationAssignedUseCase from '../../use-cases/process-classification-assigned.use-case';
import { ClassificationAssignedEventDTO } from '../../use-cases/dtos/classification-assigned-event.dto';

export default class ClassificationAssignedConsumer {
	readonly consumerName = 'classification-assigned-consumer';

	constructor(private readonly dataSource: DataSource) {}

	async handle(message: ConsumeMessage, channel: Channel): Promise<void> {
		const payload = JSON.parse(message.content.toString()) as ClassificationAssignedEventDTO;
		const messageId = message.properties.messageId || payload.eventId;

		await this.dataSource.transaction(async (manager) => {
			const processedRepository = new ProcessedMessageTypeormRepository(manager);
			const alreadyProcessed = await processedRepository.findByConsumerAndMessageId(
				this.consumerName,
				messageId,
			);

			if (alreadyProcessed) {
				logger.info({ messageId }, 'Skipping duplicated consumed event.');
				return;
			}

			const useCase = new ProcessClassificationAssignedUseCase(
				new ProfileTypeormRepository(manager),
				new AuditLogTypeormRepository(manager),
			);

			await useCase.execute(payload);

			const processedMessage = new ProcessedMessage();
			processedMessage.id = randomUUID();
			processedMessage.consumerName = this.consumerName;
			processedMessage.messageId = messageId;
			processedMessage.correlationId =
				message.properties.correlationId || payload.correlationId;
			processedMessage.processedAt = new Date();

			await processedRepository.save(processedMessage);
		});

		channel.ack(message);
	}
}
