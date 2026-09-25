import ForbiddenError from '../../../shared/kernel/exceptions/forbidden.error';
import NotFoundError from '../../../shared/kernel/exceptions/not-found.error';
import IGetTicketRepository from './repositories/iget-ticket.repository';
import { TicketResponse, toTicketResponse } from './ticket-response';
import { TicketActor } from './update-ticket.use-case';

export default class GetTicketUseCase {
	constructor(private readonly ticketRepository: IGetTicketRepository) {}

	async execute(ticketId: string, actor: TicketActor): Promise<TicketResponse> {
		const ticket = await this.ticketRepository.findById(ticketId);
		if (!ticket) throw new NotFoundError('not_found');
		const allowed =
			actor.role === 'admin'
				? await this.ticketRepository.hasDepartmentMembership(ticket.departmentId, actor.id)
				: ticket.requesterId === actor.id;
		if (!allowed) throw new ForbiddenError('forbidden');
		return toTicketResponse(ticket);
	}
}
