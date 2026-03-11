import AuditLogSchema from '../../adapters/repositories/schemas/audit-log.schema';
import IdempotencyKeySchema from '../../adapters/repositories/schemas/idempotency-key.schema';
import OutboxEventSchema from '../../adapters/repositories/schemas/outbox-event.schema';
import ProcessedMessageSchema from '../../adapters/repositories/schemas/processed-message.schema';
import ProfileSchema from '../../../features/profile/adapters/repositories/schemas/profile.schema';

export const databaseEntities = [
	ProfileSchema,
	OutboxEventSchema,
	IdempotencyKeySchema,
	ProcessedMessageSchema,
	AuditLogSchema,
];
