import Department from '../../entities/department.entity';

export default interface IDepartmentRepository {
	save(department: Department): Promise<Department>;
	update(department: Department): Promise<Department>;
	findByIdForUpdate(id: string): Promise<Department | undefined>;
	replaceAllowedUsers(departmentId: string, userIds: string[]): Promise<void>;
}
