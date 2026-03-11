import Profile from '../../../src/features/profile/entities/profile.entity';
import EntityType from '../../../src/features/profile/entities/enums/entity-type.enum';
import ProfileStatus from '../../../src/features/profile/entities/enums/profile-status.enum';
import FindProfileByExternalIdUseCase from '../../../src/features/profile/use-cases/find-profile-by-external-id.use-case';
import FakeProfileRepository from './fakes/fake-profile.repository';

describe('FindProfileByExternalIdUseCase', () => {
	it('returns the mapped profile', async () => {
		const profiles = new FakeProfileRepository();
		const useCase = new FindProfileByExternalIdUseCase(profiles);

		const profile = new Profile();
		profile.id = '6756bd03-dde0-42f8-9af1-96acae4d24cb';
		profile.externalId = 'profile-001';
		profile.displayName = 'Alpha';
		profile.email = 'alpha@example.com';
		profile.entityType = EntityType.Individual;
		profile.status = ProfileStatus.Active;
		await profiles.save(profile);

		const output = await useCase.execute('profile-001');

		expect(output.externalId).toBe('profile-001');
		expect(output.displayName).toBe('Alpha');
	});
});
