import Department from './department.entity';

export default class DepartmentAllowedUser {
	departmentId!: string;
	position!: number;
	userId!: string;
	department?: Department;
}
