import ForbiddenError from '../../../shared/kernel/exceptions/forbidden.error';
import NotFoundError from '../../../shared/kernel/exceptions/not-found.error';
import IListTicketHistoryRepository, {
	HistoryRow,
	ListTicketHistoryFilters,
} from './repositories/ilist-ticket-history.repository';
import { TicketActor } from './update-ticket.use-case';

export default class ListTicketHistoryUseCase {
	constructor(private readonly repository: IListTicketHistoryRepository) {}

	async execute(
		actor: TicketActor,
		filters: ListTicketHistoryFilters,
	): Promise<{
		data: HistoryRow[];
		pagination: { page: number; size: number; total: number; totalPages: number };
	}> {
		if (filters.ticketId) {
			const ticket = await this.repository.findById(filters.ticketId);
			if (!ticket) throw new NotFoundError('not_found');
			const allowed =
				actor.role === 'admin'
					? await this.repository.hasDepartmentMembership(ticket.departmentId, actor.id)
					: ticket.requesterId === actor.id;
			if (!allowed) throw new ForbiddenError('forbidden');
		}
		const { rows, total } = await this.repository.findHistoryPage(
			{ kind: actor.role === 'admin' ? 'admin' : 'requester', actorId: actor.id },
			filters,
		);
		return {
			data: rows,
			pagination: {
				page: filters.page,
				size: filters.size,
				total,
				totalPages: total === 0 ? 0 : Math.ceil(total / filters.size),
			},
		};
	}
}
