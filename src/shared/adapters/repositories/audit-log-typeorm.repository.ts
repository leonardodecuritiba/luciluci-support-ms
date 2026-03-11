import { EntityManager, Repository } from 'typeorm';

import AuditLog from '../../entities/audit-log.entity';
import IAuditLogRepository from '../../interfaces/iaudit-log.repository';

export default class AuditLogTypeormRepository implements IAuditLogRepository {
	private readonly repository: Repository<AuditLog>;

	constructor(managerOrRepository: EntityManager | Repository<AuditLog>) {
		this.repository =
			managerOrRepository instanceof Repository
				? managerOrRepository
				: managerOrRepository.getRepository(AuditLog);
	}

	save(log: AuditLog): Promise<AuditLog> {
		return this.repository.save(log);
	}
}
