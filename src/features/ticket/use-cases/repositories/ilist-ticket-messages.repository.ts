import Ticket from '../../entities/ticket.entity';
import TicketMessage from '../../entities/ticket-message.entity';

export interface ListTicketMessagesFilters {
	page: number;
	size: number;
	isVisibleToRequester?: boolean;
}

export interface MessagePage {
	messages: TicketMessage[];
	total: number;
}

export default interface IListTicketMessagesRepository {
	findById(id: string): Promise<Ticket | undefined>;
	hasDepartmentMembership(departmentId: string, userId: string): Promise<boolean>;
	findMessagePage(
		ticketId: string,
		visibility: boolean | undefined,
		filters: ListTicketMessagesFilters,
	): Promise<MessagePage>;
	findMediaByMessageIds(messageIds: string[]): Promise<Map<string, string[]>>;
}
