import { EntitySchema } from 'typeorm';

import Department from '../../../entities/department.entity';

const DepartmentSchema = new EntitySchema<Department>({
	name: 'Department',
	target: Department,
	tableName: 'departments',
	columns: {
		id: { type: String, primary: true },
		name: { type: String },
		type: { type: String },
		active: { type: Boolean, default: true },
		createdAt: { name: 'created_at', type: Date, createDate: true },
		updatedAt: { name: 'updated_at', type: Date, updateDate: true },
	},
	relations: {
		allowedUsers: {
			type: 'one-to-many',
			target: 'DepartmentAllowedUser',
			inverseSide: 'department',
			cascade: ['insert'],
		},
	},
});

export default DepartmentSchema;
