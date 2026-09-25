import Ticket from './ticket.entity';

export default class TicketMessage {
	id!: string;
	ticketId!: string;
	message!: string;
	type!: 'admin' | 'backoffice' | 'cd';
	authorId!: string;
	isVisibleToRequester!: boolean;
	createdAt!: Date;
	ticket?: Ticket;
}
