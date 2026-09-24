import { randomUUID } from 'node:crypto';

import ForbiddenError from '../../../shared/kernel/exceptions/forbidden.error';
import NotFoundError from '../../../shared/kernel/exceptions/not-found.error';
import UnprocessableEntityError from '../../../shared/kernel/exceptions/unprocessable-entity.error';
import IDepartmentRepository from '../../department/use-cases/repositories/idepartment.repository';
import TicketAdminStatus from '../entities/enums/ticket-admin-status.enum';
import TicketAuditAction from '../entities/enums/ticket-audit-action.enum';
import TicketPriority from '../entities/enums/ticket-priority.enum';
import TicketAuditLog from '../entities/ticket-audit-log.entity';
import IUpdateTicketRepository from './repositories/iupdate-ticket.repository';
import { TicketResponse, toTicketResponse } from './ticket-response';

export type TicketActorRole = 'admin' | 'backoffice' | 'cd';

export interface UpdateTicketInput {
	priority?: TicketPriority;
	departmentId?: string;
	adminStatus?: TicketAdminStatus;
}

export interface TicketActor {
	id: string;
	role: TicketActorRole;
}

export default class UpdateTicketUseCase {
	constructor(
		private readonly departmentRepository: IDepartmentRepository,
		private readonly ticketRepository: IUpdateTicketRepository,
		private readonly now: () => Date = () => new Date(),
		private readonly uuid: () => string = randomUUID,
	) {}

	async execute(
		ticketId: string,
		input: UpdateTicketInput,
		actor: TicketActor,
	): Promise<TicketResponse> {
		// The transaction locks the Ticket first, then every relevant Department in UUID order.
		const ticket = await this.ticketRepository.findByIdForUpdate(ticketId);
		if (!ticket) throw new NotFoundError('not_found');

		const currentId = ticket.departmentId;
		const targetId =
			input.departmentId !== undefined && input.departmentId !== currentId
				? input.departmentId
				: undefined;
		const departments = new Map<
			string,
			Awaited<ReturnType<IDepartmentRepository['findByIdForUpdate']>>
		>();
		for (const id of [...new Set([currentId, ...(targetId ? [targetId] : [])])].sort()) {
			departments.set(id, await this.departmentRepository.findByIdForUpdate(id));
		}

		const current = departments.get(currentId);
		if (!current) throw new NotFoundError('not_found');
		if (actor.role === 'admin') {
			if (!current.allowedUsers.some((membership) => membership.userId === actor.id)) {
				throw new ForbiddenError('forbidden');
			}
		} else if (ticket.requesterId !== actor.id) {
			throw new ForbiddenError('forbidden');
		}

		if (targetId) {
			const target = departments.get(targetId);
			if (!target) throw new NotFoundError('not_found');
			if (!target.active) {
				throw new UnprocessableEntityError('department_inactive', [
					{
						field: 'departmentId',
						code: 'department_inactive',
						message: 'Department is inactive.',
					},
				]);
			}
			if (
				actor.role === 'admin' &&
				!target.allowedUsers.some((membership) => membership.userId === actor.id)
			) {
				throw new ForbiddenError('forbidden');
			}
		}

		const statusChanged =
			input.adminStatus !== undefined && input.adminStatus !== ticket.adminStatus;
		const changed =
			statusChanged ||
			(input.priority !== undefined && input.priority !== ticket.priority) ||
			targetId !== undefined;
		if (!changed) return toTicketResponse(ticket);

		if (input.priority !== undefined) ticket.priority = input.priority;
		if (targetId) ticket.departmentId = targetId;
		if (input.adminStatus !== undefined) ticket.adminStatus = input.adminStatus;
		const now = this.now();
		ticket.updatedAt =
			now.getTime() > ticket.updatedAt.getTime()
				? now
				: new Date(ticket.updatedAt.getTime() + 1);
		await this.ticketRepository.updateTicket(ticket);

		if (statusChanged) {
			const auditLog = new TicketAuditLog();
			auditLog.id = this.uuid();
			auditLog.ticketId = ticket.id;
			auditLog.datetime = ticket.updatedAt;
			auditLog.authorId = actor.id;
			auditLog.origin = actor.role;
			auditLog.action = TicketAuditAction.AlteracaoStatus;
			auditLog.statusType = 'admin';
			auditLog.newStatus = ticket.adminStatus;
			await this.ticketRepository.createAuditLog(auditLog);
		}
		return toTicketResponse(ticket);
	}
}
