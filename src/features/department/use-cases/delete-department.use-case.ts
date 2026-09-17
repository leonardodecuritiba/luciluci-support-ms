import NotFoundError from '../../../shared/kernel/exceptions/not-found.error';
import IDepartmentRepository from './repositories/idepartment.repository';

export default class DeleteDepartmentUseCase {
	constructor(
		private readonly departmentRepository: IDepartmentRepository,
		private readonly now: () => Date = () => new Date(),
	) {}

	async execute(id: string): Promise<void> {
		const department = await this.departmentRepository.findByIdForUpdate(id);
		if (!department) throw new NotFoundError('not_found');
		if (!department.active) return;

		department.active = false;
		department.updatedAt = this.now();
		await this.departmentRepository.update(department);
	}
}
