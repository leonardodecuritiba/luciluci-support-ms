import request from 'supertest';

import {
	buildTestApp,
	clearDatabase,
	destroyTestDataSource,
	initializeTestDataSource,
} from '../../helpers/test-helpers';

describe('Integration: GET /profiles/by-external-id/:externalId', () => {
	beforeAll(async () => {
		await initializeTestDataSource();
	});

	beforeEach(async () => {
		await clearDatabase();
	});

	afterAll(async () => {
		await destroyTestDataSource();
	});

	it('returns 404 with standardized payload when the profile does not exist', async () => {
		const app = buildTestApp();

		const response = await request(app)
			.get('/profiles/by-external-id/unknown-profile')
			.set('X-Correlation-ID', '3f00bd9d-638d-4ae7-92f8-b73f49943ca1');

		expect(response.status).toBe(404);
		expect(response.body).toEqual(
			expect.objectContaining({
				code: 'PROFILE_NOT_FOUND',
				correlationId: '3f00bd9d-638d-4ae7-92f8-b73f49943ca1',
			}),
		);
	});
});
