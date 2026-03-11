import request from 'supertest';

import TestDataSource from '../../../src/shared/infrastructure/database/data-source-test';
import Profile from '../../../src/features/profile/entities/profile.entity';
import EntityType from '../../../src/features/profile/entities/enums/entity-type.enum';
import ProfileStatus from '../../../src/features/profile/entities/enums/profile-status.enum';
import {
	buildTestApp,
	clearDatabase,
	destroyTestDataSource,
	initializeTestDataSource,
} from '../../helpers/test-helpers';

describe('Integration: GET /profiles', () => {
	beforeAll(async () => {
		await initializeTestDataSource();
	});

	beforeEach(async () => {
		await clearDatabase();
	});

	afterAll(async () => {
		await destroyTestDataSource();
	});

	it('returns paginated data with filters and sorting', async () => {
		const app = buildTestApp();
		const repository = TestDataSource.getRepository(Profile);

		await repository.save([
			Object.assign(new Profile(), {
				id: '2677e8f2-6cf1-4ca5-8504-0455d2d91536',
				externalId: 'profile-001',
				displayName: 'Alpha',
				email: 'alpha@example.com',
				entityType: EntityType.Individual,
				status: ProfileStatus.Active,
			}),
			Object.assign(new Profile(), {
				id: '0d1f5a7a-45cc-45ca-a889-a478f96e3fe3',
				externalId: 'profile-002',
				displayName: 'Beta',
				email: 'beta@example.com',
				entityType: EntityType.Organization,
				status: ProfileStatus.Pending,
			}),
			Object.assign(new Profile(), {
				id: 'c99e71f6-d94c-4b1e-8189-a0a02bd31fd1',
				externalId: 'profile-003',
				displayName: 'Gamma',
				email: 'gamma@example.com',
				entityType: EntityType.Individual,
				status: ProfileStatus.Active,
				classificationIdSnapshot: 'class-gold',
			}),
		]);

		const response = await request(app).get('/profiles').query({
			page: 1,
			limit: 1,
			status: 'active',
			sortBy: 'displayName',
			order: 'ASC',
		});

		expect(response.status).toBe(200);
		expect(response.body.data).toHaveLength(1);
		expect(response.body.pagination).toEqual({
			page: 1,
			limit: 1,
			total: 2,
			totalPages: 2,
		});
		expect(response.body.data[0].displayName).toBe('Alpha');
	});
});
