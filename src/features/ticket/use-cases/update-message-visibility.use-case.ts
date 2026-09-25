import ForbiddenError from '../../../shared/kernel/exceptions/forbidden.error';
import NotFoundError from '../../../shared/kernel/exceptions/not-found.error';
import UnprocessableEntityError from '../../../shared/kernel/exceptions/unprocessable-entity.error';
import IDepartmentRepository from '../../department/use-cases/repositories/idepartment.repository';
import IUpdateMessageVisibilityRepository from './repositories/iupdate-message-visibility.repository';
import { TicketMessageResponse, toTicketMessageResponse } from './ticket-message-response';
import { TicketActor } from './update-ticket.use-case';

export default class UpdateMessageVisibilityUseCase {
	constructor(
		private readonly departmentRepository: Pick<IDepartmentRepository, 'findByIdForUpdate'>,
		private readonly ticketRepository: IUpdateMessageVisibilityRepository,
	) {}

	async execute(
		ticketId: string,
		messageId: string,
		isVisibleToRequester: boolean,
		actor: TicketActor,
	): Promise<TicketMessageResponse> {
		const ticket = await this.ticketRepository.findByIdForUpdate(ticketId);
		if (!ticket) throw new NotFoundError('not_found');
		if (actor.role !== 'admin') throw new ForbiddenError('forbidden');

		const department = await this.departmentRepository.findByIdForUpdate(ticket.departmentId);
		if (!department) throw new NotFoundError('not_found');
		if (!department.allowedUsers.some((membership) => membership.userId === actor.id)) {
			throw new ForbiddenError('forbidden');
		}

		const message = await this.ticketRepository.findMessageByIdForUpdate(ticketId, messageId);
		if (!message) throw new NotFoundError('not_found');
		if (message.type !== 'admin') {
			throw new UnprocessableEntityError('validation_error', [
				{
					field: 'messageId',
					code: 'message_type',
					message: 'Only admin messages may change visibility.',
				},
			]);
		}

		const mediaIds = await this.ticketRepository.findMediaIds(message.id);
		if (message.isVisibleToRequester !== isVisibleToRequester) {
			await this.ticketRepository.updateMessageVisibility(message.id, isVisibleToRequester);
			message.isVisibleToRequester = isVisibleToRequester;
		}
		return toTicketMessageResponse(message, mediaIds);
	}
}
