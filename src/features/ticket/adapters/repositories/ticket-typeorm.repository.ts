import { EntityManager, In, Repository } from 'typeorm';

import Ticket from '../../entities/ticket.entity';
import TicketAuditLog from '../../entities/ticket-audit-log.entity';
import TicketMessage from '../../entities/ticket-message.entity';
import TicketMessageMedia from '../../entities/ticket-message-media.entity';
import ITicketRepository from '../../use-cases/repositories/iticket.repository';
import IListTicketsRepository, {
	ListTicketsFilters,
	TicketListScope,
	TicketPage,
} from '../../use-cases/repositories/ilist-tickets.repository';
import IUpdateTicketRepository from '../../use-cases/repositories/iupdate-ticket.repository';
import IGetTicketRepository from '../../use-cases/repositories/iget-ticket.repository';
import ICreateTicketMessageRepository from '../../use-cases/repositories/icreate-ticket-message.repository';
import IUpdateMessageVisibilityRepository from '../../use-cases/repositories/iupdate-message-visibility.repository';
import IListTicketMessagesRepository, {
	ListTicketMessagesFilters,
	MessagePage,
} from '../../use-cases/repositories/ilist-ticket-messages.repository';
import TicketAdminStatus from '../../entities/enums/ticket-admin-status.enum';
import DepartmentAllowedUser from '../../../department/entities/department-allowed-user.entity';

export default class TicketTypeormRepository
	implements
		ITicketRepository,
		IUpdateTicketRepository,
		IListTicketsRepository,
		IGetTicketRepository,
		ICreateTicketMessageRepository,
		IUpdateMessageVisibilityRepository,
		IListTicketMessagesRepository
{
	private readonly ticketRepository: Repository<Ticket>;

	constructor(private readonly manager: EntityManager) {
		this.ticketRepository = manager.getRepository(Ticket);
	}

	async createTicket(ticket: Ticket): Promise<Ticket> {
		if (this.manager.connection.options.type === 'sqlite') {
			const result = await this.ticketRepository
				.createQueryBuilder('ticket')
				.select('MAX(ticket.number)', 'maximum')
				.getRawOne<{ maximum: number | null }>();
			ticket.number = Number(result?.maximum ?? 0) + 1;
		}

		await this.ticketRepository.insert(ticket);
		if (this.manager.connection.options.type === 'postgres') {
			const persisted = await this.ticketRepository.findOneByOrFail({ id: ticket.id });
			ticket.number = persisted.number;
		}
		return ticket;
	}

	async findByIdForUpdate(id: string): Promise<Ticket | undefined> {
		const query = this.ticketRepository
			.createQueryBuilder('ticket')
			.where('ticket.id = :id', { id });
		if (this.manager.connection.options.type === 'postgres') query.setLock('pessimistic_write');
		return (await query.getOne()) ?? undefined;
	}

	async findById(id: string): Promise<Ticket | undefined> {
		return (await this.ticketRepository.findOneBy({ id })) ?? undefined;
	}

	async hasDepartmentMembership(departmentId: string, userId: string): Promise<boolean> {
		return this.manager.getRepository(DepartmentAllowedUser).exist({
			where: { departmentId, userId },
		});
	}

	async findPage(scope: TicketListScope, filters: ListTicketsFilters): Promise<TicketPage> {
		const query = this.ticketRepository.createQueryBuilder('ticket');
		if (scope.kind === 'requester') {
			query.where('ticket.requesterId = :scopeRequesterId', {
				scopeRequesterId: scope.actorId,
			});
		} else {
			query.where(
				'EXISTS (SELECT 1 FROM department_allowed_users membership WHERE membership.department_id = ticket.department_id AND membership.user_id = :scopeAdminId)',
				{ scopeAdminId: scope.actorId },
			);
		}
		if (filters.requesterId !== undefined)
			query.andWhere('ticket.requesterId = :filterRequesterId', {
				filterRequesterId: filters.requesterId,
			});
		if (filters.number !== undefined)
			query.andWhere('ticket.number = :number', { number: filters.number });
		if (filters.startInclusive)
			query.andWhere('ticket.createdAt >= :startInclusive', {
				startInclusive: filters.startInclusive,
			});
		if (filters.endExclusive)
			query.andWhere('ticket.createdAt < :endExclusive', {
				endExclusive: filters.endExclusive,
			});
		if (filters.status !== undefined)
			query.andWhere('ticket.adminStatus = :status', { status: filters.status });
		if (filters.origin !== undefined)
			query.andWhere('ticket.origin = :origin', { origin: filters.origin });
		if (filters.departmentId !== undefined)
			query.andWhere('ticket.departmentId = :departmentId', {
				departmentId: filters.departmentId,
			});
		if (filters.priority !== undefined)
			query.andWhere('ticket.priority = :priority', { priority: filters.priority });

		const total = await query.getCount();
		const offset = (filters.page - 1) * filters.size;
		if (offset >= total) return { tickets: [], total };
		const tickets = await query
			.orderBy('ticket.createdAt', 'DESC')
			.addOrderBy('ticket.id', 'DESC')
			.skip(offset)
			.take(filters.size)
			.getMany();
		return { tickets, total };
	}

	async updateTicket(ticket: Ticket): Promise<void> {
		await this.ticketRepository.update(ticket.id, {
			priority: ticket.priority,
			departmentId: ticket.departmentId,
			adminStatus: ticket.adminStatus,
			updatedAt: ticket.updatedAt,
		});
	}

	async updateRequesterStatus(ticket: Ticket): Promise<void> {
		await this.ticketRepository.update(ticket.id, {
			requesterStatus: ticket.requesterStatus,
			updatedAt: ticket.updatedAt,
		});
	}

	async touchAfterAdminMessage(ticketId: string, updatedAt: Date): Promise<void> {
		await this.ticketRepository.update(ticketId, { updatedAt });
	}

	async updateAfterRequesterMessage(ticketId: string, updatedAt: Date): Promise<void> {
		await this.ticketRepository.update(ticketId, {
			adminStatus: TicketAdminStatus.Pendente,
			updatedAt,
		});
	}

	async createMessage(message: TicketMessage): Promise<void> {
		await this.manager.getRepository(TicketMessage).insert(message);
	}

	async findMessageByIdForUpdate(
		ticketId: string,
		messageId: string,
	): Promise<TicketMessage | undefined> {
		const query = this.manager
			.getRepository(TicketMessage)
			.createQueryBuilder('message')
			.where('message.id = :messageId AND message.ticketId = :ticketId', {
				messageId,
				ticketId,
			});
		if (this.manager.connection.options.type === 'postgres') query.setLock('pessimistic_write');
		return (await query.getOne()) ?? undefined;
	}

	async findMediaIds(messageId: string): Promise<string[]> {
		const media = await this.manager.getRepository(TicketMessageMedia).find({
			where: { ticketMessageId: messageId },
			order: { position: 'ASC' },
		});
		return media.map((item) => item.mediaId);
	}

	async findMessagePage(
		ticketId: string,
		visibility: boolean | undefined,
		filters: ListTicketMessagesFilters,
	): Promise<MessagePage> {
		const query = this.manager
			.getRepository(TicketMessage)
			.createQueryBuilder('message')
			.where('message.ticketId = :ticketId', { ticketId });
		if (visibility !== undefined) {
			query.andWhere('message.isVisibleToRequester = :visibility', { visibility });
		}
		const total = await query.getCount();
		const offset = (filters.page - 1) * filters.size;
		if (!Number.isSafeInteger(offset) || offset >= total) return { messages: [], total };
		const messages = await query
			.orderBy('message.createdAt', 'ASC')
			.addOrderBy('message.id', 'ASC')
			.skip(offset)
			.take(filters.size)
			.getMany();
		return { messages, total };
	}

	async findMediaByMessageIds(messageIds: string[]): Promise<Map<string, string[]>> {
		const grouped = new Map<string, string[]>();
		if (messageIds.length === 0) return grouped;
		const media = await this.manager.getRepository(TicketMessageMedia).find({
			where: { ticketMessageId: In(messageIds) },
			order: { ticketMessageId: 'ASC', position: 'ASC' },
		});
		for (const item of media) {
			const ids = grouped.get(item.ticketMessageId) ?? [];
			ids.push(item.mediaId);
			grouped.set(item.ticketMessageId, ids);
		}
		return grouped;
	}

	async updateMessageVisibility(messageId: string, isVisibleToRequester: boolean): Promise<void> {
		await this.manager.getRepository(TicketMessage).update(messageId, { isVisibleToRequester });
	}

	async createMedia(media: TicketMessageMedia[]): Promise<void> {
		if (media.length > 0) await this.manager.getRepository(TicketMessageMedia).insert(media);
	}

	async createAuditLog(auditLog: TicketAuditLog): Promise<void> {
		await this.manager.getRepository(TicketAuditLog).insert(auditLog);
	}
}
