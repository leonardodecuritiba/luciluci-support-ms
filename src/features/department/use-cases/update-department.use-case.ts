import DepartmentAllowedUser from '../entities/department-allowed-user.entity';
import DepartmentType from '../entities/enums/department-type.enum';
import { DepartmentResponse, toDepartmentResponse } from './department-response';
import IDepartmentRepository from './repositories/idepartment.repository';
import NotFoundError from '../../../shared/kernel/exceptions/not-found.error';

export interface UpdateDepartmentInput {
	name?: string;
	type?: DepartmentType;
	allowedUserIds?: string[];
}

function hasOwn(input: UpdateDepartmentInput, key: keyof UpdateDepartmentInput): boolean {
	return Object.prototype.hasOwnProperty.call(input, key) && input[key] !== undefined;
}

function sameList(left: string[], right: string[]): boolean {
	return left.length === right.length && left.every((value, index) => value === right[index]);
}

function membershipsFrom(userIds: string[], departmentId: string): DepartmentAllowedUser[] {
	return userIds.map((userId, position) => {
		const membership = new DepartmentAllowedUser();
		membership.departmentId = departmentId;
		membership.position = position;
		membership.userId = userId;
		return membership;
	});
}

export default class UpdateDepartmentUseCase {
	constructor(private readonly departmentRepository: IDepartmentRepository) {}

	async execute(id: string, input: UpdateDepartmentInput): Promise<DepartmentResponse> {
		const department = await this.departmentRepository.findByIdForUpdate(id);
		if (!department) throw new NotFoundError('not_found');

		const currentAllowedUserIds = [...(department.allowedUsers ?? [])]
			.sort((left, right) => left.position - right.position)
			.map((membership) => membership.userId);
		const nextAllowedUserIds = hasOwn(input, 'allowedUserIds')
			? (input.allowedUserIds ?? [])
			: currentAllowedUserIds;
		const nameChanged = hasOwn(input, 'name') && input.name !== department.name;
		const typeChanged = hasOwn(input, 'type') && input.type !== department.type;
		const membershipChanged =
			hasOwn(input, 'allowedUserIds') && !sameList(currentAllowedUserIds, nextAllowedUserIds);

		if (!nameChanged && !typeChanged && !membershipChanged) {
			return toDepartmentResponse(department);
		}

		if (nameChanged) department.name = input.name as string;
		if (typeChanged) department.type = input.type as DepartmentType;
		// Keep active untouched: RF02 edits active and inactive departments but never restores them.
		department.updatedAt = new Date();
		const saved = await this.departmentRepository.update(department);
		saved.allowedUsers = saved.allowedUsers ?? department.allowedUsers ?? [];

		if (membershipChanged) {
			await this.departmentRepository.replaceAllowedUsers(id, nextAllowedUserIds);
			saved.allowedUsers = membershipsFrom(nextAllowedUserIds, id);
		}

		return toDepartmentResponse(saved);
	}
}
