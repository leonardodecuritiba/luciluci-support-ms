import TicketAuditAction from './enums/ticket-audit-action.enum';
import TicketOrigin from './enums/ticket-origin.enum';
import Ticket from './ticket.entity';

export default class TicketAuditLog {
	id!: string;
	ticketId!: string;
	datetime!: Date;
	authorId!: string;
	origin!: TicketOrigin;
	action!: TicketAuditAction;
	statusType!: string | null;
	newStatus!: string | null;
	ticket?: Ticket;
}
