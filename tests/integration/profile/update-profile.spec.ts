import request from 'supertest';

import OutboxEvent from '../../../src/shared/entities/outbox-event.entity';
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

describe('Integration: PATCH /profiles/:profileId', () => {
	beforeAll(async () => {
		await initializeTestDataSource();
	});

	beforeEach(async () => {
		await clearDatabase();
	});

	afterAll(async () => {
		await destroyTestDataSource();
	});

	it('updates allowed fields and creates an updated event', async () => {
		const app = buildTestApp();
		const profile = new Profile();
		profile.id = 'b7c0dc36-c2e8-48f7-81db-32ea1110af0f';
		profile.externalId = 'profile-001';
		profile.displayName = 'Alpha';
		profile.email = 'alpha@example.com';
		profile.entityType = EntityType.Individual;
		profile.status = ProfileStatus.Pending;
		await TestDataSource.getRepository(Profile).save(profile);

		const response = await request(app)
			.patch(`/profiles/${profile.id}`)
			.set('X-Idempotency-Key', 'update-key')
			.set('X-Performed-By', 'admin-1')
			.set('X-Performed-By-Type', 'admin')
			.send({
				displayName: 'Alpha Updated',
				status: 'active',
			});

		expect(response.status).toBe(200);
		expect(response.body.updatedFields).toEqual(['displayName', 'status']);

		const updatedProfile = await TestDataSource.getRepository(Profile).findOneByOrFail({
			id: profile.id,
		});
		const outboxEvents = await TestDataSource.getRepository(OutboxEvent).find();

		expect(updatedProfile.displayName).toBe('Alpha Updated');
		expect(updatedProfile.status).toBe('active');
		expect(outboxEvents).toHaveLength(1);
		expect(outboxEvents[0].eventType).toBe('profiles.profile.updated.v1');
	});
});
