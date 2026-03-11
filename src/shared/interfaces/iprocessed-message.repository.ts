import ProcessedMessage from '../entities/processed-message.entity';

export default interface IProcessedMessageRepository {
	findByConsumerAndMessageId(
		consumerName: string,
		messageId: string,
	): Promise<ProcessedMessage | null>;
	save(record: ProcessedMessage): Promise<ProcessedMessage>;
}
