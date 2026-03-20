import request from 'supertest';

import {
	buildTestApp,
	clearDatabase,
	destroyTestDataSource,
	initializeTestDataSource,
} from '../../helpers/test-helpers';

describe('Integration: HTTP error matrix', () => {
	const correlationId = '8021b0b0-5855-4c1c-8086-85bba8f4ec94';

	function readHeaders() {
		return {
			'X-Correlation-ID': correlationId,
		};
	}

	function writeHeaders(idempotencyKey = 'idempotency-key') {
		return {
			'X-Correlation-ID': correlationId,
			'X-Idempotency-Key': idempotencyKey,
		};
	}

	beforeAll(async () => {
		await initializeTestDataSource();
	});

	beforeEach(async () => {
		await clearDatabase();
	});

	afterAll(async () => {
		await destroyTestDataSource();
	});

	it('returns 400 bad_request for invalid JSON payloads', async () => {
		const app = buildTestApp();

		const response = await request(app)
			.post('/profiles')
			.set(writeHeaders('invalid-json'))
			.set('Content-Type', 'application/json')
			.send('{"externalId":');

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			status_code: 400,
			message: 'bad_request',
			errors: [
				{
					field: 'body',
					code: 'invalid_json',
					message: 'Request body contains invalid JSON.',
				},
			],
		});
	});

	it('returns 400 bad_request when X-Correlation-ID is missing', async () => {
		const app = buildTestApp();

		const response = await request(app).get('/profiles');

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			status_code: 400,
			message: 'bad_request',
			errors: [
				{
					field: 'X-Correlation-ID',
					code: 'required',
					message: 'X-Correlation-ID header is required.',
				},
			],
		});
	});

	it('returns 400 bad_request when X-Idempotency-Key is missing', async () => {
		const app = buildTestApp();

		const response = await request(app)
			.post('/profiles')
			.set({ 'X-Correlation-ID': correlationId })
			.send({
				externalId: 'profile-001',
				displayName: 'Alpha',
				email: 'alpha@example.com',
				entityType: 'individual',
			});

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			status_code: 400,
			message: 'bad_request',
			errors: [
				{
					field: 'X-Idempotency-Key',
					code: 'required',
					message: 'X-Idempotency-Key header is required for write operations.',
				},
			],
		});
	});

	it('returns 404 PROFILE_NOT_FOUND for unknown externalId lookups', async () => {
		const app = buildTestApp();

		const response = await request(app)
			.get('/profiles/by-external-id/not-found')
			.set(readHeaders());

		expect(response.status).toBe(404);
		expect(response.body).toEqual({
			status_code: 404,
			message: 'PROFILE_NOT_FOUND',
			errors: [
				{
					code: 'profile_found',
					message: 'Profile not found.',
				},
			],
		});
	});

	it('returns 409 conflict for duplicate externalId', async () => {
		const app = buildTestApp();

		await request(app).post('/profiles').set(writeHeaders('duplicate-1')).send({
			externalId: 'profile-dup',
			displayName: 'Alpha',
			email: 'alpha@example.com',
			entityType: 'individual',
		});

		const response = await request(app)
			.post('/profiles')
			.set(writeHeaders('duplicate-2'))
			.send({
				externalId: 'profile-dup',
				displayName: 'Alpha Dup',
				email: 'alpha-dup@example.com',
				entityType: 'individual',
			});

		expect(response.status).toBe(409);
		expect(response.body).toEqual({
			status_code: 409,
			message: 'PROFILE_EXTERNAL_ID_ALREADY_EXISTS',
			errors: [
				{
					field: 'name',
					code: 'externalId',
					message: 'A profile with the same externalId already exists.',
				},
			],
		});
	});

	it('returns 422 validation_error for invalid profile payloads', async () => {
		const app = buildTestApp();

		const response = await request(app)
			.post('/profiles')
			.set(writeHeaders('validation-422'))
			.send({
				displayName: 'Missing externalId',
			});

		expect(response.status).toBe(422);
		expect(response.body).toEqual(
			expect.objectContaining({
				status_code: 422,
				message: 'validation_error',
				errors: expect.any(Array),
			}),
		);
	});
});
