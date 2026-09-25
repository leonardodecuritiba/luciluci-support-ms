import TicketMessage from '../entities/ticket-message.entity';

export interface TicketMessageResponse {
	id: string;
	ticketId: string;
	message: string;
	type: 'admin' | 'backoffice' | 'cd';
	authorId: string;
	mediaIds: string[];
	isVisibleToRequester: boolean;
	createdAt: Date;
}

export function toTicketMessageResponse(
	message: TicketMessage,
	mediaIds: string[],
): TicketMessageResponse {
	return {
		id: message.id,
		ticketId: message.ticketId,
		message: message.message,
		type: message.type,
		authorId: message.authorId,
		mediaIds: [...mediaIds],
		isVisibleToRequester: message.isVisibleToRequester,
		createdAt: message.createdAt,
	};
}
