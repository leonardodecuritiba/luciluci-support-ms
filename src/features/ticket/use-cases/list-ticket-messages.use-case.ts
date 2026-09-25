import ForbiddenError from '../../../shared/kernel/exceptions/forbidden.error';
import NotFoundError from '../../../shared/kernel/exceptions/not-found.error';
import IListTicketMessagesRepository, {
	ListTicketMessagesFilters,
} from './repositories/ilist-ticket-messages.repository';
import { TicketMessageResponse, toTicketMessageResponse } from './ticket-message-response';
import { TicketActor } from './update-ticket.use-case';

export interface ListTicketMessagesResponse {
	data: TicketMessageResponse[];
	pagination: { page: number; size: number; total: number; totalPages: number };
}

export default class ListTicketMessagesUseCase {
	constructor(private readonly repository: IListTicketMessagesRepository) {}

	async execute(
		ticketId: string,
		actor: TicketActor,
		filters: ListTicketMessagesFilters,
	): Promise<ListTicketMessagesResponse> {
		const ticket = await this.repository.findById(ticketId);
		if (!ticket) throw new NotFoundError('not_found');
		const allowed =
			actor.role === 'admin'
				? await this.repository.hasDepartmentMembership(ticket.departmentId, actor.id)
				: ticket.requesterId === actor.id;
		if (!allowed) throw new ForbiddenError('forbidden');

		const pagination = { page: filters.page, size: filters.size, total: 0, totalPages: 0 };
		if (actor.role !== 'admin' && filters.isVisibleToRequester === false) {
			return { data: [], pagination };
		}

		const visibility = actor.role === 'admin' ? filters.isVisibleToRequester : true;
		const { messages, total } = await this.repository.findMessagePage(
			ticketId,
			visibility,
			filters,
		);
		const media = await this.repository.findMediaByMessageIds(
			messages.map((message) => message.id),
		);
		return {
			data: messages.map((message) =>
				toTicketMessageResponse(message, media.get(message.id) ?? []),
			),
			pagination: {
				...pagination,
				total,
				totalPages: total === 0 ? 0 : Math.ceil(total / filters.size),
			},
		};
	}
}
