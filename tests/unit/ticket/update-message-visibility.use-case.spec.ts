import Department from '../../../src/features/department/entities/department.entity';
import DepartmentAllowedUser from '../../../src/features/department/entities/department-allowed-user.entity';
import Ticket from '../../../src/features/ticket/entities/ticket.entity';
import TicketMessage from '../../../src/features/ticket/entities/ticket-message.entity';
import IUpdateMessageVisibilityRepository from '../../../src/features/ticket/use-cases/repositories/iupdate-message-visibility.repository';
import UpdateMessageVisibilityUseCase from '../../../src/features/ticket/use-cases/update-message-visibility.use-case';

const ticketId = 'f57d57a6-3b94-4d4b-bf09-73c127e02c45';
const messageId = 'f57d57a6-3b94-4d4b-bf09-73c127e02c46';

function fixture(visible = true, type: TicketMessage['type'] = 'admin') {
	const ticket = Object.assign(new Ticket(), {
		id: ticketId,
		departmentId: 'a19cf070-ea36-41df-9382-e44d541f8003',
		requesterId: 'owner',
		updatedAt: new Date('2026-09-25T10:00:00Z'),
	});
	const department = Object.assign(new Department(), {
		id: ticket.departmentId,
		active: false,
		type: 'cd',
		allowedUsers: [
			Object.assign(new DepartmentAllowedUser(), { userId: 'admin-a' }),
			Object.assign(new DepartmentAllowedUser(), { userId: 'admin-b' }),
		],
	});
	const message = Object.assign(new TicketMessage(), {
		id: messageId,
		ticketId,
		message: 'Admin response',
		type,
		authorId: 'admin-a',
		isVisibleToRequester: visible,
		createdAt: new Date('2026-09-25T10:00:01Z'),
	});
	const calls: string[] = [];
	const departments = {
		findByIdForUpdate: jest.fn(async (): Promise<Department | undefined> => {
			calls.push('department');
			return department;
		}),
	};
	const tickets = {
		findByIdForUpdate: jest.fn(async (): Promise<Ticket | undefined> => {
			calls.push('ticket');
			return ticket;
		}),
		findMessageByIdForUpdate: jest.fn(async (): Promise<TicketMessage | undefined> => {
			calls.push('message');
			return message;
		}),
		findMediaIds: jest.fn(async () => {
			calls.push('media');
			return ['x', 'y', 'x'];
		}),
		updateMessageVisibility: jest.fn(async () => {
			calls.push('update');
		}),
	} satisfies IUpdateMessageVisibilityRepository;
	const useCase = new UpdateMessageVisibilityUseCase(departments, tickets);
	return { ticket, department, message, departments, tickets, calls, useCase };
}

describe('Unit: RF11 update admin message visibility', () => {
	it.each([
		[true, false],
		[false, true],
	] as const)('changes visibility %s -> %s with a focal update', async (before, after) => {
		const f = fixture(before);
		const ticketUpdatedAt = f.ticket.updatedAt;
		const response = await f.useCase.execute(ticketId, messageId, after, {
			id: 'admin-b',
			role: 'admin',
		});
		expect(f.calls).toEqual(['ticket', 'department', 'message', 'media', 'update']);
		expect(f.tickets.findMessageByIdForUpdate).toHaveBeenCalledWith(ticketId, messageId);
		expect(f.tickets.updateMessageVisibility).toHaveBeenCalledWith(messageId, after);
		expect(Object.keys(response)).toEqual([
			'id',
			'ticketId',
			'message',
			'type',
			'authorId',
			'mediaIds',
			'isVisibleToRequester',
			'createdAt',
		]);
		expect(response).toMatchObject({
			authorId: 'admin-a',
			mediaIds: ['x', 'y', 'x'],
			isVisibleToRequester: after,
		});
		expect(f.ticket.updatedAt).toBe(ticketUpdatedAt);
		expect(f.department.active).toBe(false);
	});

	it.each([true, false])('returns a no-op when visibility is already %s', async (visible) => {
		const f = fixture(visible);
		const response = await f.useCase.execute(ticketId, messageId, visible, {
			id: 'admin-b',
			role: 'admin',
		});
		expect(response.isVisibleToRequester).toBe(visible);
		expect(f.calls).toEqual(['ticket', 'department', 'message', 'media']);
		expect(f.tickets.updateMessageVisibility).not.toHaveBeenCalled();
	});

	it.each(['backoffice', 'cd'] as const)('denies owner role %s', async (role) => {
		const f = fixture();
		await expect(
			f.useCase.execute(ticketId, messageId, false, { id: 'owner', role }),
		).rejects.toMatchObject({ statusCode: 403 });
		expect(f.calls).toEqual(['ticket']);
	});

	it('denies an admin without current membership', async () => {
		const f = fixture();
		f.department.allowedUsers = [];
		await expect(
			f.useCase.execute(ticketId, messageId, false, { id: 'admin-b', role: 'admin' }),
		).rejects.toMatchObject({ statusCode: 403 });
		expect(f.calls).toEqual(['ticket', 'department']);
	});

	it('returns 404 for an absent Ticket or scoped Message', async () => {
		const missingTicket = fixture();
		missingTicket.tickets.findByIdForUpdate.mockResolvedValueOnce(undefined);
		await expect(
			missingTicket.useCase.execute(ticketId, messageId, false, {
				id: 'admin-b',
				role: 'admin',
			}),
		).rejects.toMatchObject({ statusCode: 404 });
		const missingMessage = fixture();
		missingMessage.tickets.findMessageByIdForUpdate.mockResolvedValueOnce(undefined);
		await expect(
			missingMessage.useCase.execute(ticketId, messageId, false, {
				id: 'admin-b',
				role: 'admin',
			}),
		).rejects.toMatchObject({ statusCode: 404 });
		expect(missingMessage.tickets.updateMessageVisibility).not.toHaveBeenCalled();
	});

	it.each(['backoffice', 'cd'] as const)('rejects non-admin Message %s', async (type) => {
		const f = fixture(true, type);
		await expect(
			f.useCase.execute(ticketId, messageId, false, { id: 'admin-b', role: 'admin' }),
		).rejects.toMatchObject({ statusCode: 422 });
		expect(f.tickets.findMediaIds).not.toHaveBeenCalled();
		expect(f.tickets.updateMessageVisibility).not.toHaveBeenCalled();
	});
});
