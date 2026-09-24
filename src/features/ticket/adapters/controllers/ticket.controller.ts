import { Request, Response } from 'express';
import { DataSource } from 'typeorm';

import DepartmentTypeormRepository from '../../../department/adapters/repositories/department-typeorm.repository';
import CreateTicketUseCase from '../../use-cases/create-ticket.use-case';
import { validateDto } from '../../../../shared/kernel/validation/validate-dto';
import TicketTypeormRepository from '../repositories/ticket-typeorm.repository';
import CreateTicketRequestDTO from './dtos/create-ticket-request.dto';

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
	};
}
