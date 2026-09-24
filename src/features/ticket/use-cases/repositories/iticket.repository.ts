import Ticket from '../../entities/ticket.entity';
import TicketAuditLog from '../../entities/ticket-audit-log.entity';
import TicketMessage from '../../entities/ticket-message.entity';
import TicketMessageMedia from '../../entities/ticket-message-media.entity';

export default interface ITicketRepository {
	createTicket(ticket: Ticket): Promise<Ticket>;
	createMessage(message: TicketMessage): Promise<void>;
	createMedia(media: TicketMessageMedia[]): Promise<void>;
	createAuditLog(auditLog: TicketAuditLog): Promise<void>;
}
