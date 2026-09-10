import { Request, Response } from 'express';
import { DataSource } from 'typeorm';

import { validateDto } from '../../../../shared/kernel/validation/validate-dto';
import UnprocessableEntityError from '../../../../shared/kernel/exceptions/unprocessable-entity.error';
import DepartmentTypeormRepository from '../repositories/department-typeorm.repository';
import CreateDepartmentRequestDTO from './dtos/create-department-request.dto';
import UpdateDepartmentPathDTO from './dtos/update-department-path.dto';
import UpdateDepartmentRequestDTO from './dtos/update-department-request.dto';
import CreateDepartmentUseCase from '../../use-cases/create-department.use-case';
import UpdateDepartmentUseCase from '../../use-cases/update-department.use-case';

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
		update: async (req: Request, res: Response): Promise<void> => {
			const { departmentId } = await validateDto(UpdateDepartmentPathDTO, req.params);
			if (req.body === null || typeof req.body !== 'object' || Array.isArray(req.body)) {
				throw new UnprocessableEntityError('validation_error', [
					{
						field: 'body',
						code: 'object',
						message: 'Request body must be a JSON object.',
					},
				]);
			}
			const payload = await validateDto(UpdateDepartmentRequestDTO, req.body);
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
				new UpdateDepartmentUseCase(new DepartmentTypeormRepository(manager)).execute(
					departmentId,
					payload,
				),
			);

			res.status(200).json(response);
		},
	};
}
