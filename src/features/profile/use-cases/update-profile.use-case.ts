import { randomUUID } from 'node:crypto';

import AuditLog from '../../../shared/entities/audit-log.entity';
import OutboxEvent from '../../../shared/entities/outbox-event.entity';
import IAuditLogRepository from '../../../shared/interfaces/iaudit-log.repository';
import IOutboxEventRepository from '../../../shared/interfaces/ioutbox-event.repository';
import { env } from '../../../shared/utils/env';
import EntityType from '../entities/enums/entity-type.enum';
import ProfileStatus from '../entities/enums/profile-status.enum';
import IProfileRepository from './repositories/iprofile.repository';
import { ActionContextDTO } from './dtos/action-context.dto';

export interface UpdateProfileInput {
	displayName?: string;
	email?: string;
	phone?: string;
	entityType?: EntityType;
	country?: string;
	city?: string;
	status?: ProfileStatus;
}

export interface UpdateProfileOutput {
	profileId: string;
	updatedFields: string[];
	updatedAt: string;
}

export default class UpdateProfileUseCase {
	constructor(
		private readonly profileRepository: IProfileRepository,
		private readonly outboxRepository: IOutboxEventRepository,
		private readonly auditLogRepository: IAuditLogRepository,
	) {}

	async execute(
		profileId: string,
		input: UpdateProfileInput,
		context: ActionContextDTO,
	): Promise<UpdateProfileOutput> {
		const profile = await this.profileRepository.findByIdOrFail(profileId);

		const changedFields = profile.updateEditableFields({
			displayName: input.displayName?.trim(),
			email: input.email?.trim().toLowerCase(),
			phone: input.phone?.trim(),
			entityType: input.entityType,
			country: input.country?.trim(),
			city: input.city?.trim(),
			status: input.status,
		});

		await this.profileRepository.save(profile);

		if (changedFields.length > 0) {
			const event = new OutboxEvent();
			event.id = randomUUID();
			event.aggregateType = 'Profile';
			event.aggregateId = profile.id;
			event.eventType = 'profiles.profile.updated.v1';
			event.exchange = env.rabbitmq.profileExchange;
			event.routingKey = event.eventType;
			event.occurredAt = new Date();
			event.payload = {
				eventId: randomUUID(),
				correlationId: context.correlationId,
				occurredAt: event.occurredAt.toISOString(),
				profileId: profile.id,
				externalId: profile.externalId,
				changedFields,
				status: profile.status,
				entityType: profile.entityType,
				email: profile.email,
			};

			await this.outboxRepository.save(event);
		}

		const auditLog = new AuditLog();
		auditLog.id = randomUUID();
		auditLog.action = 'profile.updated';
		auditLog.resourceType = 'profile';
		auditLog.resourceId = profile.id;
		auditLog.correlationId = context.correlationId;
		auditLog.performedBy = context.performedBy;
		auditLog.performedByType = context.performedByType;
		auditLog.metadata = {
			changedFields,
		};

		await this.auditLogRepository.save(auditLog);

		return {
			profileId: profile.id,
			updatedFields: changedFields,
			updatedAt: profile.updatedAt.toISOString(),
		};
	}
}
