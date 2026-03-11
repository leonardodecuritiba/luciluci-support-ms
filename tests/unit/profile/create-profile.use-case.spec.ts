import CreateProfileUseCase from '../../../src/features/profile/use-cases/create-profile.use-case';
import EntityType from '../../../src/features/profile/entities/enums/entity-type.enum';
import ProfileStatus from '../../../src/features/profile/entities/enums/profile-status.enum';
import ConflictError from '../../../src/shared/kernel/exceptions/conflict.error';
import FakeAuditLogRepository from './fakes/fake-audit-log.repository';
import FakeOutboxRepository from './fakes/fake-outbox.repository';
import FakeProfileRepository from './fakes/fake-profile.repository';

describe('CreateProfileUseCase', () => {
	it('creates a profile, outbox event and audit log', async () => {
		const profiles = new FakeProfileRepository();
		const outbox = new FakeOutboxRepository();
		const auditLogs = new FakeAuditLogRepository();
		const useCase = new CreateProfileUseCase(profiles, outbox, auditLogs);

		const output = await useCase.execute(
			{
				externalId: 'profile-001',
				displayName: 'Alpha',
				email: 'alpha@example.com',
				entityType: EntityType.Individual,
				status: ProfileStatus.Active,
			},
			{
				correlationId: '3bdad846-8d2f-4813-aac4-cb79a0b1ee74',
			},
		);

		expect(output.profileId).toBeDefined();
		expect(profiles.items).toHaveLength(1);
		expect(outbox.items).toHaveLength(1);
		expect(outbox.items[0].eventType).toBe('profiles.profile.created.v1');
		expect(auditLogs.items).toHaveLength(1);
	});

	it('throws conflict when externalId already exists', async () => {
		const profiles = new FakeProfileRepository();
		const outbox = new FakeOutboxRepository();
		const auditLogs = new FakeAuditLogRepository();
		const useCase = new CreateProfileUseCase(profiles, outbox, auditLogs);

		await useCase.execute(
			{
				externalId: 'profile-001',
				displayName: 'Alpha',
				email: 'alpha@example.com',
				entityType: EntityType.Individual,
			},
			{
				correlationId: '3bdad846-8d2f-4813-aac4-cb79a0b1ee74',
			},
		);

		await expect(
			useCase.execute(
				{
					externalId: 'profile-001',
					displayName: 'Beta',
					email: 'beta@example.com',
					entityType: EntityType.Organization,
				},
				{
					correlationId: 'df95f1f8-fc7f-4521-bd04-6041fa498326',
				},
			),
		).rejects.toBeInstanceOf(ConflictError);
	});
});
