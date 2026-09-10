import { EntitySchema } from 'typeorm';

import DepartmentAllowedUser from '../../../entities/department-allowed-user.entity';

const DepartmentAllowedUserSchema = new EntitySchema<DepartmentAllowedUser>({
	name: 'DepartmentAllowedUser',
	target: DepartmentAllowedUser,
	tableName: 'department_allowed_users',
	columns: {
		departmentId: { name: 'department_id', type: String, primary: true },
		position: { type: Number, primary: true },
		userId: { name: 'user_id', type: String },
	},
	relations: {
		department: {
			type: 'many-to-one',
			target: 'Department',
			joinColumn: { name: 'department_id', referencedColumnName: 'id' },
			onDelete: 'CASCADE',
		},
	},
});

export default DepartmentAllowedUserSchema;
