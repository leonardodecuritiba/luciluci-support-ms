import { randomUUID } from 'node:crypto';

import ForbiddenError from '../../../shared/kernel/exceptions/forbidden.error';
import NotFoundError from '../../../shared/kernel/exceptions/not-found.error';
import TicketAuditAction from '../entities/enums/ticket-audit-action.enum';
import TicketRequesterStatus from '../entities/enums/ticket-requester-status.enum';
import TicketAuditLog from '../entities/ticket-audit-log.entity';
import IUpdateTicketRepository from './repositories/iupdate-ticket.repository';
import { TicketResponse, toTicketResponse } from './ticket-response';
import { TicketActor } from './update-ticket.use-case';

export default class ResolveTicketUseCase {
	constructor(
		private readonly ticketRepository: IUpdateTicketRepository,
		private readonly now: () => Date = () => new Date(),
		private readonly uuid: () => string = randomUUID,
	) {}

	async execute(ticketId: string, actor: TicketActor): Promise<TicketResponse> {
		const ticket = await this.ticketRepository.findByIdForUpdate(ticketId);
		if (!ticket) throw new NotFoundError('not_found');
		if (actor.role === 'admin' || ticket.requesterId !== actor.id) {
			throw new ForbiddenError('forbidden');
		}
		if (ticket.requesterStatus === TicketRequesterStatus.Resolvido) {
			return toTicketResponse(ticket);
		}

		ticket.requesterStatus = TicketRequesterStatus.Resolvido;
		const now = this.now();
		ticket.updatedAt =
			now.getTime() > ticket.updatedAt.getTime()
				? now
				: new Date(ticket.updatedAt.getTime() + 1);
		await this.ticketRepository.updateRequesterStatus(ticket);

		const auditLog = new TicketAuditLog();
		auditLog.id = this.uuid();
		auditLog.ticketId = ticket.id;
		auditLog.datetime = ticket.updatedAt;
		auditLog.authorId = actor.id;
		auditLog.origin = actor.role;
		auditLog.action = TicketAuditAction.AlteracaoStatus;
		auditLog.statusType = 'requester';
		auditLog.newStatus = TicketRequesterStatus.Resolvido;
		await this.ticketRepository.createAuditLog(auditLog);

		return toTicketResponse(ticket);
	}
}
