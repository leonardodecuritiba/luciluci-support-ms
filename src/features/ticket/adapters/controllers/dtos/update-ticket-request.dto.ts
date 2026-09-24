import { IsEnum, IsUUID, ValidateIf } from 'class-validator';

import TicketAdminStatus from '../../../entities/enums/ticket-admin-status.enum';
import TicketPriority from '../../../entities/enums/ticket-priority.enum';

export default class UpdateTicketRequestDTO {
	@ValidateIf((_object, value) => value !== undefined)
	@IsEnum(TicketPriority)
	priority?: TicketPriority;

	@ValidateIf((_object, value) => value !== undefined)
	@IsUUID('4')
	departmentId?: string;

	@ValidateIf((_object, value) => value !== undefined)
	@IsEnum(TicketAdminStatus)
	adminStatus?: TicketAdminStatus;
}
