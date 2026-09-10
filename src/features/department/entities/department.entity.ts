import DepartmentAllowedUser from './department-allowed-user.entity';
import DepartmentType from './enums/department-type.enum';

export default class Department {
	id!: string;
	name!: string;
	type!: DepartmentType;
	active: boolean = true;
	allowedUsers!: DepartmentAllowedUser[];
	createdAt!: Date;
	updatedAt!: Date;
}
