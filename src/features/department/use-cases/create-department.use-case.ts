import { randomUUID } from 'node:crypto';

import Department from '../entities/department.entity';
import DepartmentAllowedUser from '../entities/department-allowed-user.entity';
import DepartmentType from '../entities/enums/department-type.enum';
import IDepartmentRepository from './repositories/idepartment.repository';
import { DepartmentResponse, toDepartmentResponse } from './department-response';

export interface CreateDepartmentInput {
	name: string;
	type: DepartmentType;
	allowedUserIds?: string[];
}

export default class CreateDepartmentUseCase {
	constructor(private readonly departmentRepository: IDepartmentRepository) {}

	async execute(input: CreateDepartmentInput): Promise<DepartmentResponse> {
		const department = new Department();
		department.id = randomUUID();
		department.name = input.name;
		department.type = input.type;
		department.active = true;
		department.allowedUsers = (input.allowedUserIds ?? []).map((userId, position) => {
			const membership = new DepartmentAllowedUser();
			membership.departmentId = department.id;
			membership.position = position;
			membership.userId = userId;
			return membership;
		});

		const saved = await this.departmentRepository.save(department);
		return toDepartmentResponse(saved);
	}
}

export { DepartmentResponse, toDepartmentResponse } from './department-response';
