import { EntityManager, Repository } from 'typeorm';

import OutboxEvent from '../../entities/outbox-event.entity';
import IOutboxEventRepository from '../../interfaces/ioutbox-event.repository';

export default class OutboxEventTypeormRepository implements IOutboxEventRepository {
	private readonly repository: Repository<OutboxEvent>;

	constructor(managerOrRepository: EntityManager | Repository<OutboxEvent>) {
		this.repository =
			managerOrRepository instanceof Repository
				? managerOrRepository
				: managerOrRepository.getRepository(OutboxEvent);
	}

	save(event: OutboxEvent): Promise<OutboxEvent> {
		return this.repository.save(event);
	}

	findPending(limit: number): Promise<OutboxEvent[]> {
		return this.repository
			.createQueryBuilder('outbox_event')
			.where('outbox_event.publishedAt IS NULL')
			.orderBy('outbox_event.occurredAt', 'ASC')
			.take(limit)
			.getMany();
	}

	async markProcessed(id: string): Promise<void> {
		const processedAt = new Date();
		await this.repository.update(
			{ id },
			{ publishedAt: processedAt, processedAt, lastError: null },
		);
	}

	async markFailed(id: string, errorMessage: string): Promise<void> {
		const event = await this.repository.findOneByOrFail({ id });
		event.attempts += 1;
		event.lastError = errorMessage;
		await this.repository.save(event);
	}
}
