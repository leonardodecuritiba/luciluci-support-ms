import { randomUUID } from 'node:crypto';

import AppDataSource from '../src/shared/infrastructure/database/data-source';
import logger from '../src/shared/infrastructure/logger';
import ProfileTypeormRepository from '../src/features/profile/adapters/repositories/profile-typeorm.repository';
import Profile from '../src/features/profile/entities/profile.entity';
import EntityType from '../src/features/profile/entities/enums/entity-type.enum';
import ProfileStatus from '../src/features/profile/entities/enums/profile-status.enum';

async function seed(): Promise<void> {
	await AppDataSource.initialize();
	const profileRepository = new ProfileTypeormRepository(AppDataSource.manager);

	const seedProfiles: Array<Partial<Profile>> = [
		{
			id: '0d88f29d-cb90-41d7-98ac-fd084cd15911',
			externalId: 'seed-profile-001',
			displayName: 'Alpha Profile',
			email: 'alpha@standard-ms.local',
			entityType: EntityType.Individual,
			status: ProfileStatus.Active,
			country: 'BR',
			city: 'Sao Paulo',
			classificationIdSnapshot: 'class-gold',
			classificationNameSnapshot: 'Gold',
		},
		{
			id: 'd5333677-baf7-48aa-b4fd-d0f81d0a9f6c',
			externalId: 'seed-profile-002',
			displayName: 'Beta Profile',
			email: 'beta@standard-ms.local',
			entityType: EntityType.Organization,
			status: ProfileStatus.Pending,
			country: 'PY',
			city: 'Asuncion',
		},
		{
			id: '934ef7c3-f7bc-4875-ae1d-201c4a5c25a8',
			externalId: 'seed-profile-003',
			displayName: 'Gamma Profile',
			email: 'gamma@standard-ms.local',
			entityType: EntityType.Individual,
			status: ProfileStatus.Inactive,
			country: 'BR',
			city: 'Curitiba',
			classificationIdSnapshot: 'class-silver',
			classificationNameSnapshot: 'Silver',
		},
	];

	for (const item of seedProfiles) {
		const existing = await profileRepository.findByExternalId(item.externalId!);

		if (existing) {
			continue;
		}

		const profile = new Profile();
		profile.id = item.id ?? randomUUID();
		profile.externalId = item.externalId!;
		profile.displayName = item.displayName!;
		profile.email = item.email!;
		profile.entityType = item.entityType!;
		profile.status = item.status!;
		profile.country = item.country;
		profile.city = item.city;
		profile.classificationIdSnapshot = item.classificationIdSnapshot;
		profile.classificationNameSnapshot = item.classificationNameSnapshot;

		await profileRepository.save(profile);
	}

	logger.info('Seed executed successfully.');
	await AppDataSource.destroy();
}

seed().catch(async (error) => {
	logger.error({ err: error }, 'Failed to execute seed.');

	if (AppDataSource.isInitialized) {
		await AppDataSource.destroy();
	}

	process.exit(1);
});
