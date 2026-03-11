import { EntityManager, Repository } from 'typeorm';

import IdempotencyKey from '../../entities/idempotency-key.entity';
import IIdempotencyKeyRepository from '../../interfaces/iidempotency-key.repository';

export default class IdempotencyKeyTypeormRepository implements IIdempotencyKeyRepository {
	private readonly repository: Repository<IdempotencyKey>;

	constructor(managerOrRepository: EntityManager | Repository<IdempotencyKey>) {
		this.repository =
			managerOrRepository instanceof Repository
				? managerOrRepository
				: managerOrRepository.getRepository(IdempotencyKey);
	}

	findByKey(key: string): Promise<IdempotencyKey | null> {
		return this.repository.findOneBy({ key });
	}

	save(record: IdempotencyKey): Promise<IdempotencyKey> {
		return this.repository.save(record);
	}

	update(record: IdempotencyKey): Promise<IdempotencyKey> {
		return this.repository.save(record);
	}

	async deleteById(id: string): Promise<void> {
		await this.repository.delete({ id });
	}
}
