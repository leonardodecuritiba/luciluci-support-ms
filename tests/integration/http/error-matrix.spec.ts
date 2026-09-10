import request from 'supertest';

import {
	buildTestApp,
	destroyTestDataSource,
	initializeTestDataSource,
} from '../../helpers/test-helpers';

describe('Integration: Support bootstrap HTTP surface', () => {
	const correlationId = '8021b0b0-5855-4c1c-8086-85bba8f4ec94';

	beforeAll(async () => {
		await initializeTestDataSource();
	});

	afterAll(async () => {
		await destroyTestDataSource();
	});

	it('keeps operational health honest about disabled messaging', async () => {
		const response = await request(buildTestApp()).get('/health');

		expect(response.status).toBe(200);
		expect(response.headers['x-correlation-id']).toEqual(expect.any(String));
		expect(response.body).toMatchObject({
			status: 'ok',
			database: true,
			messaging: {
				enabled: false,
				status: 'not_applicable',
			},
		});
	});

	it('keeps operational metrics available without correlation', async () => {
		const response = await request(buildTestApp()).get('/metrics');

		expect(response.status).toBe(200);
		expect(response.headers['x-correlation-id']).toEqual(expect.any(String));
		expect(response.headers['content-type']).toContain('text/plain');
	});

	it('rejects a non-operational request without X-Correlation-ID', async () => {
		const response = await request(buildTestApp()).get('/profiles');

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

	it('proves Profile is not registered when correlation is valid', async () => {
		const response = await request(buildTestApp())
			.get('/profiles')
			.set('X-Correlation-ID', correlationId);

		expect(response.status).toBe(404);
		expect(response.headers['x-correlation-id']).toBe(correlationId);
	});

	it('keeps the standard error envelope for malformed JSON before route resolution', async () => {
		const response = await request(buildTestApp())
			.post('/unregistered')
			.set('X-Correlation-ID', correlationId)
			.set('Content-Type', 'application/json')
			.send('{"invalid":');

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
});
