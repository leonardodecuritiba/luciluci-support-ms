import Department from '../../entities/department.entity';

export default interface IDepartmentRepository {
	save(department: Department): Promise<Department>;
}
