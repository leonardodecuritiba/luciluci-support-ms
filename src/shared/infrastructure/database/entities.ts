import IdempotencyKeySchema from '../../adapters/repositories/schemas/idempotency-key.schema';
import DepartmentSchema from '../../../features/department/adapters/repositories/schemas/department.schema';
import DepartmentAllowedUserSchema from '../../../features/department/adapters/repositories/schemas/department-allowed-user.schema';

export const databaseEntities = [
	IdempotencyKeySchema,
	DepartmentSchema,
	DepartmentAllowedUserSchema,
];
