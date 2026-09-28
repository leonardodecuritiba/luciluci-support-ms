import Ticket from '../../../src/features/ticket/entities/ticket.entity';
import ListTicketHistoryUseCase from '../../../src/features/ticket/use-cases/list-ticket-history.use-case';
import IListTicketHistoryRepository from '../../../src/features/ticket/use-cases/repositories/ilist-ticket-history.repository';
import { parseListTicketHistoryQuery } from '../../../src/features/ticket/adapters/controllers/dtos/list-ticket-history-query.dto';

const ticket = { id: 'ticket-1', departmentId: 'department-1', requesterId: 'owner-1' } as Ticket;

function repository(): jest.Mocked<IListTicketHistoryRepository> {
	return {
		findById: jest.fn().mockResolvedValue(ticket),
		hasDepartmentMembership: jest.fn().mockResolvedValue(true),
		findHistoryPage: jest.fn().mockResolvedValue({ rows: [], total: 0 }),
	};
}

describe('RF13 history use case and strict query', () => {
	it('scopes unfiltered reads and preserves empty pagination', async () => {
		const repo = repository();
		const filters = { page: 3, size: 2 };
		const result = await new ListTicketHistoryUseCase(repo).execute(
			{ id: 'admin-1', role: 'admin' },
			filters,
		);
		expect(repo.findById).not.toHaveBeenCalled();
		expect(repo.findHistoryPage).toHaveBeenCalledWith(
			{ kind: 'admin', actorId: 'admin-1' },
			filters,
		);
		expect(result).toEqual({
			data: [],
			pagination: { page: 3, size: 2, total: 0, totalPages: 0 },
		});
	});

	it('checks explicit Ticket existence and current membership or ownership', async () => {
		const repo = repository();
		const useCase = new ListTicketHistoryUseCase(repo);
		const filters = { ticketId: ticket.id, page: 1, size: 20 };
		await useCase.execute({ id: 'admin-1', role: 'admin' }, filters);
		expect(repo.hasDepartmentMembership).toHaveBeenCalledWith(ticket.departmentId, 'admin-1');
		await useCase.execute({ id: 'owner-1', role: 'cd' }, filters);
		expect(repo.hasDepartmentMembership).toHaveBeenCalledTimes(1);
		expect(repo.findHistoryPage).toHaveBeenLastCalledWith(
			{ kind: 'requester', actorId: 'owner-1' },
			filters,
		);
		await expect(
			useCase.execute({ id: 'other', role: 'backoffice' }, filters),
		).rejects.toMatchObject({ statusCode: 403 });
		repo.hasDepartmentMembership.mockResolvedValueOnce(false);
		await expect(
			useCase.execute({ id: 'admin-2', role: 'admin' }, filters),
		).rejects.toMatchObject({ statusCode: 403 });
		repo.findById.mockResolvedValueOnce(undefined);
		await expect(
			useCase.execute({ id: 'admin-1', role: 'admin' }, filters),
		).rejects.toMatchObject({ statusCode: 404 });
	});

	it('computes total pages from scoped repository total', async () => {
		const repo = repository();
		repo.findHistoryPage.mockResolvedValueOnce({ rows: [], total: 5 });
		const result = await new ListTicketHistoryUseCase(repo).execute(
			{ id: 'owner-1', role: 'backoffice' },
			{ page: 4, size: 2 },
		);
		expect(result.pagination).toEqual({ page: 4, size: 2, total: 5, totalPages: 3 });
	});

	it('accepts only a UUID v4 and decimal positive safe pagination', () => {
		const id = '00000000-0000-4000-8000-000000000001';
		expect(parseListTicketHistoryQuery('/history')).toEqual({
			ticketId: undefined,
			page: 1,
			size: 20,
		});
		expect(parseListTicketHistoryQuery(`/history?ticketId=${id}&page=2&size=100`)).toEqual({
			ticketId: id,
			page: 2,
			size: 100,
		});
		for (const query of [
			'ticketId=x',
			'ticketId=',
			'ticketId=x&ticketId=y',
			'page=0',
			'page=1.2',
			'page=-1',
			'page=+1',
			'page=9007199254740992',
			'size=0',
			'size=101',
			'page=1&page=2',
			'size=2&size=3',
			'action=nova_mensagem',
			'foo=bar',
		]) {
			expect(() => parseListTicketHistoryQuery(`/history?${query}`)).toThrow();
		}
	});
});
