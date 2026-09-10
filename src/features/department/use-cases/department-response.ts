import Department from '../entities/department.entity';
import DepartmentType from '../entities/enums/department-type.enum';

export interface DepartmentResponse {
	id: string;
	name: string;
	allowedUserIds: string[];
	type: DepartmentType;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

export function toDepartmentResponse(department: Department): DepartmentResponse {
	return {
		id: department.id,
		name: department.name,
		allowedUserIds: [...(department.allowedUsers ?? [])]
			.sort((left, right) => left.position - right.position)
			.map((membership) => membership.userId),
		type: department.type,
		active: department.active,
		createdAt: department.createdAt.toISOString(),
		updatedAt: department.updatedAt.toISOString(),
	};
}
