import { EntitySchema } from 'typeorm';

import ProcessedMessage from '../../../entities/processed-message.entity';

const ProcessedMessageSchema = new EntitySchema<ProcessedMessage>({
  name: 'ProcessedMessage',
  target: ProcessedMessage,
  tableName: 'processed_messages',
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid',
    },
    consumerName: {
      name: 'consumer_name',
      type: String,
    },
    messageId: {
      name: 'message_id',
      type: String,
    },
    correlationId: {
      name: 'correlation_id',
      type: String,
      nullable: true,
    },
    processedAt: {
      name: 'processed_at',
      type: Date,
    },
    createdAt: {
      name: 'created_at',
      type: Date,
      createDate: true,
    },
  },
  indices: [
    {
      name: 'idx_processed_messages_consumer_message',
      columns: ['consumerName', 'messageId'],
      unique: true,
    },
  ],
});

export default ProcessedMessageSchema;

