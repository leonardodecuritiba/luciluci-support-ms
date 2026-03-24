import { faker } from '@faker-js/faker';

import AppDataSource from '../src/shared/infrastructure/database/data-source';
import logger from '../src/shared/infrastructure/logger';
import ProfileTypeormRepository from '../src/features/profile/adapters/repositories/profile-typeorm.repository';
import Profile from '../src/features/profile/entities/profile.entity';
import EntityType from '../src/features/profile/entities/enums/entity-type.enum';
import ProfileStatus from '../src/features/profile/entities/enums/profile-status.enum';

const FAKER_SEED = 20260324;
const GENERATED_PROFILE_COUNT = 117;

const LOCATIONS = [
	{ country: 'BR', city: 'Sao Paulo' },
	{ country: 'BR', city: 'Curitiba' },
	{ country: 'BR', city: 'Recife' },
	{ country: 'BR', city: 'Porto Alegre' },
	{ country: 'PY', city: 'Asuncion' },
	{ country: 'AR', city: 'Buenos Aires' },
];

const CLASSIFICATIONS = [
	{ id: 'class-gold', name: 'Gold' },
	{ id: 'class-silver', name: 'Silver' },
	{ id: 'class-bronze', name: 'Bronze' },
	{ id: 'class-platinum', name: 'Platinum' },
];

const REFERENCE_PROFILES: Array<Partial<Profile>> = [
	{
		id: '0d88f29d-cb90-41d7-98ac-fd084cd15911',
		externalId: 'seed-profile-001',
		displayName: 'Alpha Profile',
		email: 'alpha@standard-ms.local',
		phone: '+55 11 98888-0001',
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
		phone: '+595 981 000002',
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
		phone: '+55 41 98888-0003',
		entityType: EntityType.Individual,
		status: ProfileStatus.Inactive,
		country: 'BR',
		city: 'Curitiba',
		classificationIdSnapshot: 'class-silver',
		classificationNameSnapshot: 'Silver',
	},
];

function buildGeneratedProfiles(): Array<Partial<Profile>> {
	faker.seed(FAKER_SEED);

	return Array.from({ length: GENERATED_PROFILE_COUNT }, (_, rawIndex) => {
		const index = rawIndex + 4;
		const entityType = index % 5 === 0 ? EntityType.Organization : EntityType.Individual;
		const status = resolveStatus(index);
		const location = LOCATIONS[index % LOCATIONS.length];
		const classification =
			status === ProfileStatus.Active || status === ProfileStatus.Inactive
				? CLASSIFICATIONS[index % CLASSIFICATIONS.length]
				: undefined;
		const displayName =
			entityType === EntityType.Organization ? faker.company.name() : faker.person.fullName();

		return {
			id: faker.string.uuid(),
			externalId: `seed-profile-${String(index).padStart(3, '0')}`,
			displayName,
			email: `seed-profile-${String(index).padStart(3, '0')}@standard-ms.local`,
			phone: faker.phone.number(),
			entityType,
			status,
			country: location.country,
			city: location.city,
			classificationIdSnapshot: classification?.id,
			classificationNameSnapshot: classification?.name,
		};
	});
}

function resolveStatus(index: number): ProfileStatus {
	const statuses = [
		ProfileStatus.Active,
		ProfileStatus.Pending,
		ProfileStatus.Inactive,
		ProfileStatus.Blocked,
	];

	return statuses[index % statuses.length]!;
}

function applyProfileData(target: Profile, source: Partial<Profile>): void {
	target.externalId = source.externalId!;
	target.displayName = source.displayName!;
	target.email = source.email!;
	target.phone = source.phone;
	target.entityType = source.entityType!;
	target.status = source.status!;
	target.country = source.country;
	target.city = source.city;
	target.classificationIdSnapshot = source.classificationIdSnapshot;
	target.classificationNameSnapshot = source.classificationNameSnapshot;
}

async function seed(): Promise<void> {
	await AppDataSource.initialize();
	const profileRepository = new ProfileTypeormRepository(AppDataSource.manager);
	const seedProfiles = [...REFERENCE_PROFILES, ...buildGeneratedProfiles()];
	let created = 0;
	let updated = 0;

	for (const item of seedProfiles) {
		const existing = await profileRepository.findByExternalId(item.externalId!);
		const profile = existing ?? new Profile();

		if (!existing) {
			profile.id = item.id!;
			created += 1;
		} else {
			updated += 1;
		}

		applyProfileData(profile, item);
		await profileRepository.save(profile);
	}

	logger.info(
		{
			totalProfiles: seedProfiles.length,
			referenceProfiles: REFERENCE_PROFILES.length,
			generatedProfiles: GENERATED_PROFILE_COUNT,
			fakerSeed: FAKER_SEED,
			created,
			updated,
		},
		'Seed executed successfully.',
	);
	await AppDataSource.destroy();
}

seed().catch(async (error) => {
	logger.error({ err: error }, 'Failed to execute seed.');

	if (AppDataSource.isInitialized) {
		await AppDataSource.destroy();
	}

	process.exit(1);
});
