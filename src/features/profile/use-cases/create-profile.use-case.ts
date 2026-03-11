import { randomUUID } from 'node:crypto';

import AuditLog from '../../../shared/entities/audit-log.entity';
import OutboxEvent from '../../../shared/entities/outbox-event.entity';
import ConflictError from '../../../shared/kernel/exceptions/conflict.error';
import IAuditLogRepository from '../../../shared/interfaces/iaudit-log.repository';
import IOutboxEventRepository from '../../../shared/interfaces/ioutbox-event.repository';
import { env } from '../../../shared/utils/env';
import Profile from '../entities/profile.entity';
import ProfileStatus from '../entities/enums/profile-status.enum';
import EntityType from '../entities/enums/entity-type.enum';
import IProfileRepository from './repositories/iprofile.repository';
import { ActionContextDTO } from './dtos/action-context.dto';

export interface CreateProfileInput {
  externalId: string;
  displayName: string;
  email: string;
  phone?: string;
  entityType: EntityType;
  country?: string;
  city?: string;
  status?: ProfileStatus;
}

export interface CreateProfileOutput {
  profileId: string;
}

export default class CreateProfileUseCase {
  constructor(
    private readonly profileRepository: IProfileRepository,
    private readonly outboxRepository: IOutboxEventRepository,
    private readonly auditLogRepository: IAuditLogRepository,
  ) {}

  async execute(
    input: CreateProfileInput,
    context: ActionContextDTO,
  ): Promise<CreateProfileOutput> {
    const existing = await this.profileRepository.findByExternalId(input.externalId);

    if (existing) {
      throw new ConflictError(
        'PROFILE_EXTERNAL_ID_ALREADY_EXISTS',
        'A profile with the same externalId already exists.',
      );
    }

    const profile = new Profile();
    profile.id = randomUUID();
    profile.externalId = input.externalId;
    profile.displayName = input.displayName.trim();
    profile.email = input.email.trim().toLowerCase();
    profile.phone = input.phone?.trim();
    profile.entityType = input.entityType;
    profile.country = input.country?.trim();
    profile.city = input.city?.trim();
    profile.status = input.status ?? ProfileStatus.Pending;

    await this.profileRepository.save(profile);

    const event = new OutboxEvent();
    event.aggregateType = 'Profile';
    event.aggregateId = profile.id;
    event.eventType = 'profiles.profile.created.v1';
    event.exchange = env.rabbitmq.profileExchange;
    event.routingKey = event.eventType;
    event.occurredAt = new Date();
    event.payload = {
      eventId: randomUUID(),
      correlationId: context.correlationId,
      occurredAt: event.occurredAt.toISOString(),
      profileId: profile.id,
      externalId: profile.externalId,
      status: profile.status,
      entityType: profile.entityType,
      email: profile.email,
    };

    await this.outboxRepository.save(event);

    const auditLog = new AuditLog();
    auditLog.action = 'profile.created';
    auditLog.resourceType = 'profile';
    auditLog.resourceId = profile.id;
    auditLog.correlationId = context.correlationId;
    auditLog.performedBy = context.performedBy;
    auditLog.performedByType = context.performedByType;
    auditLog.metadata = {
      externalId: profile.externalId,
    };

    await this.auditLogRepository.save(auditLog);

    return { profileId: profile.id };
  }
}
