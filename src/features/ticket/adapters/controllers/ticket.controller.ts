import { Request, Response } from 'express';
import { DataSource } from 'typeorm';

import DepartmentTypeormRepository from '../../../department/adapters/repositories/department-typeorm.repository';
import CreateTicketUseCase from '../../use-cases/create-ticket.use-case';
import UpdateTicketUseCase, { TicketActorRole } from '../../use-cases/update-ticket.use-case';
import ListTicketsUseCase from '../../use-cases/list-tickets.use-case';
import ResolveTicketUseCase from '../../use-cases/resolve-ticket.use-case';
import GetTicketUseCase from '../../use-cases/get-ticket.use-case';
import BadRequestError from '../../../../shared/kernel/exceptions/bad-request.error';
import ForbiddenError from '../../../../shared/kernel/exceptions/forbidden.error';
import UnprocessableEntityError from '../../../../shared/kernel/exceptions/unprocessable-entity.error';
import { validateDto } from '../../../../shared/kernel/validation/validate-dto';
import TicketTypeormRepository from '../repositories/ticket-typeorm.repository';
import CreateTicketRequestDTO from './dtos/create-ticket-request.dto';
import { parseListTicketsQuery } from './dtos/list-tickets-query.dto';
import UpdateTicketPathDTO from './dtos/update-ticket-path.dto';
import UpdateTicketRequestDTO from './dtos/update-ticket-request.dto';

export default function buildTicketController(dataSource: DataSource) {
	async function list(req: Request, res: Response, kind: 'requester' | 'admin'): Promise<void> {
		const actorId = req.performedBy;
		const role = req.performedByType;
		if (!actorId?.trim() || !['admin', 'backoffice', 'cd'].includes(role ?? '')) {
			throw new BadRequestError('bad_request');
		}
		if (kind === 'admin' ? role !== 'admin' : role === 'admin') {
			throw new ForbiddenError('forbidden');
		}
		const pathId = kind === 'admin' ? req.params.adminId : req.params.requesterId;
		if (typeof pathId !== 'string' || !pathId.trim()) {
			throw new UnprocessableEntityError('validation_error');
		}
		if (actorId !== pathId) {
			throw new ForbiddenError('forbidden');
		}
		if (req.body !== undefined) {
			throw new UnprocessableEntityError('validation_error', [
				{ field: 'body', code: 'forbidden', message: 'Request body is not allowed.' },
			]);
		}
		const filters = parseListTicketsQuery(req.originalUrl, kind === 'admin');
		const response = await new ListTicketsUseCase(
			new TicketTypeormRepository(dataSource.manager),
		).execute({ kind, actorId }, filters);
		res.status(200).json(response);
	}

	return {
		getById: async (req: Request, res: Response): Promise<void> => {
			const callerId = req.performedBy;
			const callerRole = req.performedByType;
			if (!callerId?.trim() || !['admin', 'backoffice', 'cd'].includes(callerRole ?? '')) {
				throw new BadRequestError('bad_request');
			}
			const { ticketId } = await validateDto(UpdateTicketPathDTO, req.params);
			if (req.originalUrl.includes('?')) {
				throw new UnprocessableEntityError('validation_error', [
					{
						field: 'query',
						code: 'forbidden',
						message: 'Query parameters are not allowed.',
					},
				]);
			}
			if (req.body !== undefined) {
				throw new UnprocessableEntityError('validation_error', [
					{ field: 'body', code: 'forbidden', message: 'Request body is not allowed.' },
				]);
			}
			const response = await new GetTicketUseCase(
				new TicketTypeormRepository(dataSource.manager),
			).execute(ticketId, { id: callerId, role: callerRole as TicketActorRole });
			res.status(200).json(response);
		},
		listByRequester: (req: Request, res: Response): Promise<void> =>
			list(req, res, 'requester'),
		listByAdmin: (req: Request, res: Response): Promise<void> => list(req, res, 'admin'),
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
		resolve: async (req: Request, res: Response): Promise<void> => {
			const callerId = req.performedBy;
			const callerRole = req.performedByType;
			if (!callerId?.trim() || !['admin', 'backoffice', 'cd'].includes(callerRole ?? '')) {
				throw new BadRequestError('bad_request');
			}
			const { ticketId } = await validateDto(UpdateTicketPathDTO, req.params);
			if (req.body !== undefined) {
				throw new UnprocessableEntityError('validation_error', [
					{ field: 'body', code: 'forbidden', message: 'Request body is not allowed.' },
				]);
			}
			const response = await dataSource.transaction((manager) =>
				new ResolveTicketUseCase(new TicketTypeormRepository(manager)).execute(ticketId, {
					id: callerId,
					role: callerRole as TicketActorRole,
				}),
			);
			res.status(200).json(response);
		},
	};
}
