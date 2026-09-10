import { Request, Response } from 'express';
import { DataSource } from 'typeorm';

import { validateDto } from '../../../../shared/kernel/validation/validate-dto';
import DepartmentTypeormRepository from '../repositories/department-typeorm.repository';
import CreateDepartmentRequestDTO from './dtos/create-department-request.dto';
import CreateDepartmentUseCase from '../../use-cases/create-department.use-case';

export default function buildDepartmentController(dataSource: DataSource) {
	return {
		create: async (req: Request, res: Response): Promise<void> => {
			const payload = await validateDto(CreateDepartmentRequestDTO, req.body);
			const response = await dataSource.transaction((manager) =>
				new CreateDepartmentUseCase(new DepartmentTypeormRepository(manager)).execute(
					payload,
				),
			);

			res.status(201).json(response);
		},
	};
}
