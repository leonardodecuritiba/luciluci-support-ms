import Ticket from '../../entities/ticket.entity';
import TicketMessage from '../../entities/ticket-message.entity';

export default interface IUpdateMessageVisibilityRepository {
	findByIdForUpdate(id: string): Promise<Ticket | undefined>;
	findMessageByIdForUpdate(
		ticketId: string,
		messageId: string,
	): Promise<TicketMessage | undefined>;
	findMediaIds(messageId: string): Promise<string[]>;
	updateMessageVisibility(messageId: string, isVisibleToRequester: boolean): Promise<void>;
}
