export default class ProcessedMessage {
	id!: string;
	consumerName!: string;
	messageId!: string;
	correlationId?: string | null;
	processedAt!: Date;
	createdAt!: Date;
}
