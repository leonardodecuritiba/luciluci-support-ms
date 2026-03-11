import { randomUUID } from 'node:crypto';

import AuditLog from '../../../shared/entities/audit-log.entity';
import IAuditLogRepository from '../../../shared/interfaces/iaudit-log.repository';
import IProfileRepository from './repositories/iprofile.repository';
import { ClassificationAssignedEventDTO } from './dtos/classification-assigned-event.dto';

export default class ProcessClassificationAssignedUseCase {
	constructor(
		private readonly profileRepository: IProfileRepository,
		private readonly auditLogRepository: IAuditLogRepository,
	) {}

	async execute(input: ClassificationAssignedEventDTO): Promise<void> {
		const profile = await this.profileRepository.findByIdOrFail(input.profileId);
		profile.updateClassificationSnapshot(input.classificationId, input.classificationName);

		await this.profileRepository.save(profile);

		const auditLog = new AuditLog();
		auditLog.id = randomUUID();
		auditLog.action = 'classification.assigned.consumed';
		auditLog.resourceType = 'profile';
		auditLog.resourceId = profile.id;
		auditLog.correlationId = input.correlationId;
		auditLog.performedBy = 'classification-consumer';
		auditLog.performedByType = 'system';
		auditLog.metadata = {
			classificationId: input.classificationId,
			classificationName: input.classificationName,
			eventId: input.eventId,
		};

		await this.auditLogRepository.save(auditLog);
	}
}
