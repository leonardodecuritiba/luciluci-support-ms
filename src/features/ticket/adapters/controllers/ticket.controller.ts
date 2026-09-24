import { Request, Response } from 'express';
import { DataSource } from 'typeorm';

import DepartmentTypeormRepository from '../../../department/adapters/repositories/department-typeorm.repository';
import CreateTicketUseCase from '../../use-cases/create-ticket.use-case';
import UpdateTicketUseCase, { TicketActorRole } from '../../use-cases/update-ticket.use-case';
import BadRequestError from '../../../../shared/kernel/exceptions/bad-request.error';
import UnprocessableEntityError from '../../../../shared/kernel/exceptions/unprocessable-entity.error';
import { validateDto } from '../../../../shared/kernel/validation/validate-dto';
import TicketTypeormRepository from '../repositories/ticket-typeorm.repository';
import CreateTicketRequestDTO from './dtos/create-ticket-request.dto';
import UpdateTicketPathDTO from './dtos/update-ticket-path.dto';
import UpdateTicketRequestDTO from './dtos/update-ticket-request.dto';

export default function buildTicketController(dataSource: DataSource) {
	return {
		create: async (req: Request, res: Response): Promise<void> => {
			const payload = await validateDto(CreateTicketRequestDTO, req.body ?? {});
			const response = await dataSource.transaction((manager) =>
				new CreateTicketUseCase(
					new DepartmentTypeormRepository(manager),
					new TicketTypeormRepository(manager),
				).execute(payload),
			);

			res.status(201).json(response);
		},
		update: async (req: Request, res: Response): Promise<void> => {
			const callerId = req.performedBy;
			const callerRole = req.performedByType;
			if (
				!callerId ||
				!callerId.trim() ||
				!['admin', 'backoffice', 'cd'].includes(callerRole ?? '')
			) {
				throw new BadRequestError('bad_request');
			}
			const { ticketId } = await validateDto(UpdateTicketPathDTO, req.params);
			if (req.body === null || typeof req.body !== 'object' || Array.isArray(req.body)) {
				throw new UnprocessableEntityError('validation_error', [
					{
						field: 'body',
						code: 'object',
						message: 'Request body must be a JSON object.',
					},
				]);
			}
			const payload = await validateDto(UpdateTicketRequestDTO, req.body);
			if (!Object.values(payload).some((value) => value !== undefined)) {
				throw new UnprocessableEntityError('validation_error', [
					{
						field: 'body',
						code: 'minProperties',
						message: 'Request body must contain at least one editable field.',
					},
				]);
			}
			const response = await dataSource.transaction((manager) =>
				new UpdateTicketUseCase(
					new DepartmentTypeormRepository(manager),
					new TicketTypeormRepository(manager),
				).execute(ticketId, payload, { id: callerId, role: callerRole as TicketActorRole }),
			);
			res.status(200).json(response);
		},
	};
}
