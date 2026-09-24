import IdempotencyKeySchema from '../../adapters/repositories/schemas/idempotency-key.schema';
import DepartmentSchema from '../../../features/department/adapters/repositories/schemas/department.schema';
import DepartmentAllowedUserSchema from '../../../features/department/adapters/repositories/schemas/department-allowed-user.schema';
import TicketSchema from '../../../features/ticket/adapters/repositories/schemas/ticket.schema';
import TicketMessageSchema from '../../../features/ticket/adapters/repositories/schemas/ticket-message.schema';
import TicketMessageMediaSchema from '../../../features/ticket/adapters/repositories/schemas/ticket-message-media.schema';
import TicketAuditLogSchema from '../../../features/ticket/adapters/repositories/schemas/ticket-audit-log.schema';

export const databaseEntities = [
	IdempotencyKeySchema,
	DepartmentSchema,
	DepartmentAllowedUserSchema,
	TicketSchema,
	TicketMessageSchema,
	TicketMessageMediaSchema,
	TicketAuditLogSchema,
];
