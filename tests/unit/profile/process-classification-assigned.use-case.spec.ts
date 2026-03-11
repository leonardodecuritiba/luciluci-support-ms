import Profile from '../../../src/features/profile/entities/profile.entity';
import EntityType from '../../../src/features/profile/entities/enums/entity-type.enum';
import ProfileStatus from '../../../src/features/profile/entities/enums/profile-status.enum';
import ProcessClassificationAssignedUseCase from '../../../src/features/profile/use-cases/process-classification-assigned.use-case';
import FakeAuditLogRepository from './fakes/fake-audit-log.repository';
import FakeProfileRepository from './fakes/fake-profile.repository';

describe('ProcessClassificationAssignedUseCase', () => {
  it('updates the profile snapshot and writes an audit log', async () => {
    const profiles = new FakeProfileRepository();
    const auditLogs = new FakeAuditLogRepository();
    const useCase = new ProcessClassificationAssignedUseCase(profiles, auditLogs);

    const profile = new Profile();
    profile.id = '8f648c06-f6d1-4b0f-b607-d958e92077da';
    profile.externalId = 'profile-001';
    profile.displayName = 'Alpha';
    profile.email = 'alpha@example.com';
    profile.entityType = EntityType.Individual;
    profile.status = ProfileStatus.Active;
    await profiles.save(profile);

    await useCase.execute({
      eventId: 'a7957d1e-911e-464b-9ef9-e6dbc3892d05',
      correlationId: '76a54666-206f-499c-ae28-fc81e18914e5',
      profileId: profile.id,
      classificationId: 'class-gold',
      classificationName: 'Gold',
      occurredAt: new Date().toISOString(),
    });

    expect(profiles.items[0].classificationIdSnapshot).toBe('class-gold');
    expect(profiles.items[0].classificationNameSnapshot).toBe('Gold');
    expect(auditLogs.items).toHaveLength(1);
  });
});

