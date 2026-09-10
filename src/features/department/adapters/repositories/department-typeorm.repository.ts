import { EntityManager, Repository } from 'typeorm';

import Department from '../../entities/department.entity';
import DepartmentAllowedUser from '../../entities/department-allowed-user.entity';
import IDepartmentRepository from '../../use-cases/repositories/idepartment.repository';

export default class DepartmentTypeormRepository implements IDepartmentRepository {
	private readonly repository: Repository<Department>;
	private readonly manager: EntityManager;

	constructor(managerOrRepository: EntityManager | Repository<Department>) {
		this.manager =
			managerOrRepository instanceof Repository
				? managerOrRepository.manager
				: managerOrRepository;
		this.repository = this.manager.getRepository(Department);
	}

	save(department: Department): Promise<Department> {
		return this.repository.save(department);
	}

	async update(department: Department): Promise<Department> {
		await this.repository.update(department.id, {
			name: department.name,
			type: department.type,
			active: department.active,
			updatedAt: department.updatedAt,
		});
		return department;
	}

	async findByIdForUpdate(id: string): Promise<Department | undefined> {
		const query = this.repository
			.createQueryBuilder('department')
			.where('department.id = :id', { id });

		if (this.manager.connection.options.type === 'postgres') {
			query.setLock('pessimistic_write');
		}

		const department = await query.getOne();
		if (!department) return undefined;

		department.allowedUsers = await this.manager.getRepository(DepartmentAllowedUser).find({
			where: { departmentId: id },
			order: { position: 'ASC' },
		});
		return department;
	}

	async replaceAllowedUsers(departmentId: string, userIds: string[]): Promise<void> {
		const membershipRepository = this.manager.getRepository(DepartmentAllowedUser);
		await membershipRepository.delete({ departmentId });
		if (userIds.length === 0) return;

		await membershipRepository.insert(
			userIds.map((userId, position) => ({ departmentId, position, userId })),
		);
	}
}
