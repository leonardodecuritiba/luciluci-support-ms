import AuditLog from '../entities/audit-log.entity';

export default interface IAuditLogRepository {
	save(log: AuditLog): Promise<AuditLog>;
}
