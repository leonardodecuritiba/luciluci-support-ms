import TicketMessage from './ticket-message.entity';

export default class TicketMessageMedia {
	ticketMessageId!: string;
	position!: number;
	mediaId!: string;
	message?: TicketMessage;
}
