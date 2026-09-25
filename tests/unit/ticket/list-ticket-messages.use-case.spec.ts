import Ticket from '../../../src/features/ticket/entities/ticket.entity';
import TicketMessage from '../../../src/features/ticket/entities/ticket-message.entity';
import ListTicketMessagesUseCase from '../../../src/features/ticket/use-cases/list-ticket-messages.use-case';
import IListTicketMessagesRepository from '../../../src/features/ticket/use-cases/repositories/ilist-ticket-messages.repository';
import { parseListTicketMessagesQuery } from '../../../src/features/ticket/adapters/controllers/dtos/list-ticket-messages-query.dto';

const ticket = { id: 'ticket-1', departmentId: 'department-1', requesterId: 'owner-1' } as Ticket;
const messages = [
	{
		id: 'message-1',
		ticketId: ticket.id,
		message: 'visible',
		type: 'admin',
		authorId: 'admin-1',
		isVisibleToRequester: true,
		createdAt: new Date('2026-09-25T00:00:00Z'),
	},
	{
		id: 'message-2',
		ticketId: ticket.id,
		message: 'hidden',
		type: 'admin',
		authorId: 'admin-1',
		isVisibleToRequester: false,
		createdAt: new Date('2026-09-25T00:01:00Z'),
	},
] as TicketMessage[];

function repository(): jest.Mocked<IListTicketMessagesRepository> {
	return {
		findById: jest.fn().mockResolvedValue(ticket),
		hasDepartmentMembership: jest.fn().mockResolvedValue(true),
		findMessagePage: jest.fn().mockResolvedValue({ messages, total: 2 }),
		findMediaByMessageIds: jest
			.fn()
			.mockResolvedValue(new Map([['message-1', ['a', 'b', 'a']]])),
	};
}

describe('RF12 list Ticket messages use case and parser', () => {
	it('allows current admin membership and returns eight fields with media order', async () => {
		const repo = repository();
		const result = await new ListTicketMessagesUseCase(repo).execute(
			ticket.id,
			{ id: 'admin-1', role: 'admin' },
			{ page: 1, size: 1 },
		);
		expect(repo.hasDepartmentMembership).toHaveBeenCalledWith('department-1', 'admin-1');
		expect(repo.findMessagePage).toHaveBeenCalledWith(ticket.id, undefined, {
			page: 1,
			size: 1,
		});
		expect(repo.findMediaByMessageIds).toHaveBeenCalledWith(['message-1', 'message-2']);
		expect(result.pagination).toEqual({ page: 1, size: 1, total: 2, totalPages: 2 });
		expect(result.data[0].mediaIds).toEqual(['a', 'b', 'a']);
		expect(result.data[1].mediaIds).toEqual([]);
		expect(Object.keys(result.data[0])).toHaveLength(8);
	});

	it.each([true, false])(
		'passes admin filter %s into repository predicate',
		async (visibility) => {
			const repo = repository();
			await new ListTicketMessagesUseCase(repo).execute(
				ticket.id,
				{ id: 'admin-1', role: 'admin' },
				{ page: 1, size: 20, isVisibleToRequester: visibility },
			);
			expect(repo.findMessagePage).toHaveBeenCalledWith(
				ticket.id,
				visibility,
				expect.any(Object),
			);
		},
	);

	it.each(['backoffice', 'cd'] as const)(
		'forces %s owner scope to visible SQL predicate',
		async (role) => {
			const repo = repository();
			await new ListTicketMessagesUseCase(repo).execute(
				ticket.id,
				{ id: 'owner-1', role },
				{ page: 1, size: 20 },
			);
			expect(repo.findMessagePage).toHaveBeenCalledWith(ticket.id, true, expect.any(Object));
			expect(repo.hasDepartmentMembership).not.toHaveBeenCalled();
		},
	);

	it('short circuits owner false filter after ACL without querying messages or media', async () => {
		const repo = repository();
		const result = await new ListTicketMessagesUseCase(repo).execute(
			ticket.id,
			{ id: 'owner-1', role: 'cd' },
			{ page: 4, size: 3, isVisibleToRequester: false },
		);
		expect(result).toEqual({
			data: [],
			pagination: { page: 4, size: 3, total: 0, totalPages: 0 },
		});
		expect(repo.findMessagePage).not.toHaveBeenCalled();
		expect(repo.findMediaByMessageIds).not.toHaveBeenCalled();
	});

	it('denies non-owner and non-member, and distinguishes absent Ticket', async () => {
		const repo = repository();
		const useCase = new ListTicketMessagesUseCase(repo);
		await expect(
			useCase.execute(ticket.id, { id: 'other', role: 'cd' }, { page: 1, size: 20 }),
		).rejects.toMatchObject({ statusCode: 403 });
		repo.hasDepartmentMembership.mockResolvedValueOnce(false);
		await expect(
			useCase.execute(ticket.id, { id: 'other', role: 'admin' }, { page: 1, size: 20 }),
		).rejects.toMatchObject({ statusCode: 403 });
		repo.findById.mockResolvedValueOnce(undefined);
		await expect(
			useCase.execute(ticket.id, { id: 'other', role: 'admin' }, { page: 1, size: 20 }),
		).rejects.toMatchObject({ statusCode: 404 });
		// Department.active and ticket.origin do not participate in these checks.
	});

	it('parses defaults and strict query whitelist', () => {
		expect(parseListTicketMessagesQuery('/messages')).toEqual({
			page: 1,
			size: 20,
			isVisibleToRequester: undefined,
		});
		expect(
			parseListTicketMessagesQuery('/messages?page=2&size=5&isVisibleToRequester=false'),
		).toEqual({ page: 2, size: 5, isVisibleToRequester: false });
		for (const query of [
			'page=0',
			'page=-1',
			'page=1.2',
			'page=9007199254740992',
			'size=101',
			'size=0',
			'isVisibleToRequester=TRUE',
			'isVisibleToRequester=',
			'page=1&page=2',
			'x=1',
		]) {
			expect(() => parseListTicketMessagesQuery(`/messages?${query}`)).toThrow();
		}
	});
});
