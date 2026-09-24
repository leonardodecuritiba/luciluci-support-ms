import { EntityManager, Repository } from 'typeorm';

import Ticket from '../../entities/ticket.entity';
import TicketAuditLog from '../../entities/ticket-audit-log.entity';
import TicketMessage from '../../entities/ticket-message.entity';
import TicketMessageMedia from '../../entities/ticket-message-media.entity';
import ITicketRepository from '../../use-cases/repositories/iticket.repository';
import IUpdateTicketRepository from '../../use-cases/repositories/iupdate-ticket.repository';

export default class TicketTypeormRepository implements ITicketRepository, IUpdateTicketRepository {
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

	async updateTicket(ticket: Ticket): Promise<void> {
		await this.ticketRepository.update(ticket.id, {
			priority: ticket.priority,
			departmentId: ticket.departmentId,
			adminStatus: ticket.adminStatus,
			updatedAt: ticket.updatedAt,
		});
	}

	async createMessage(message: TicketMessage): Promise<void> {
		await this.manager.getRepository(TicketMessage).insert(message);
	}

	async createMedia(media: TicketMessageMedia[]): Promise<void> {
		if (media.length > 0) await this.manager.getRepository(TicketMessageMedia).insert(media);
	}

	async createAuditLog(auditLog: TicketAuditLog): Promise<void> {
		await this.manager.getRepository(TicketAuditLog).insert(auditLog);
	}
}
