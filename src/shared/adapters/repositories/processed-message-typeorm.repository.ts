import { EntityManager, Repository } from 'typeorm';

import ProcessedMessage from '../../entities/processed-message.entity';
import IProcessedMessageRepository from '../../interfaces/iprocessed-message.repository';

export default class ProcessedMessageTypeormRepository implements IProcessedMessageRepository {
  private readonly repository: Repository<ProcessedMessage>;

  constructor(managerOrRepository: EntityManager | Repository<ProcessedMessage>) {
    this.repository =
      managerOrRepository instanceof Repository
        ? managerOrRepository
        : managerOrRepository.getRepository(ProcessedMessage);
  }

  findByConsumerAndMessageId(
    consumerName: string,
    messageId: string,
  ): Promise<ProcessedMessage | null> {
    return this.repository.findOneBy({ consumerName, messageId });
  }

  save(record: ProcessedMessage): Promise<ProcessedMessage> {
    return this.repository.save(record);
  }
}

