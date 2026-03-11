import Profile from '../../../src/features/profile/entities/profile.entity';
import EntityType from '../../../src/features/profile/entities/enums/entity-type.enum';
import ProfileStatus from '../../../src/features/profile/entities/enums/profile-status.enum';
import UpdateProfileUseCase from '../../../src/features/profile/use-cases/update-profile.use-case';
import FakeAuditLogRepository from './fakes/fake-audit-log.repository';
import FakeOutboxRepository from './fakes/fake-outbox.repository';
import FakeProfileRepository from './fakes/fake-profile.repository';

describe('UpdateProfileUseCase', () => {
  it('updates editable fields and emits an updated event', async () => {
    const profiles = new FakeProfileRepository();
    const outbox = new FakeOutboxRepository();
    const auditLogs = new FakeAuditLogRepository();
    const useCase = new UpdateProfileUseCase(profiles, outbox, auditLogs);

    const profile = new Profile();
    profile.id = 'f3dbdfbe-02d4-46c8-95a2-eac11c7c1bf1';
    profile.externalId = 'profile-001';
    profile.displayName = 'Alpha';
    profile.email = 'alpha@example.com';
    profile.entityType = EntityType.Individual;
    profile.status = ProfileStatus.Pending;
    await profiles.save(profile);

    const output = await useCase.execute(
      profile.id,
      {
        displayName: 'Alpha Updated',
        status: ProfileStatus.Active,
      },
      {
        correlationId: 'e6999c29-cf86-4c5b-b660-f04c7b648cb7',
        performedBy: 'admin-1',
        performedByType: 'admin',
      },
    );

    expect(output.updatedFields).toEqual(['displayName', 'status']);
    expect(outbox.items).toHaveLength(1);
    expect(outbox.items[0].eventType).toBe('profiles.profile.updated.v1');
    expect(auditLogs.items).toHaveLength(1);
  });
});

