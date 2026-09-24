import TicketOrigin from './enums/ticket-origin.enum';
import Ticket from './ticket.entity';

export default class TicketMessage {
	id!: string;
	ticketId!: string;
	message!: string;
	type!: TicketOrigin;
	authorId!: string;
	isVisibleToRequester!: boolean;
	createdAt!: Date;
	ticket?: Ticket;
}
