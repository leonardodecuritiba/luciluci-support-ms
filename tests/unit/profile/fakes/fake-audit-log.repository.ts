import AuditLog from '../../../../src/shared/entities/audit-log.entity';
import IAuditLogRepository from '../../../../src/shared/interfaces/iaudit-log.repository';

export default class FakeAuditLogRepository implements IAuditLogRepository {
	items: AuditLog[] = [];

	async save(log: AuditLog): Promise<AuditLog> {
		this.items.push(log);
		return log;
	}
}
