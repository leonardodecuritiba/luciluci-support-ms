import { EntityManager, Repository } from 'typeorm';

import Department from '../../entities/department.entity';
import IDepartmentRepository from '../../use-cases/repositories/idepartment.repository';

export default class DepartmentTypeormRepository implements IDepartmentRepository {
	private readonly repository: Repository<Department>;

	constructor(managerOrRepository: EntityManager | Repository<Department>) {
		this.repository =
			managerOrRepository instanceof Repository
				? managerOrRepository
				: managerOrRepository.getRepository(Department);
	}

	save(department: Department): Promise<Department> {
		return this.repository.save(department);
	}
}
