import request from 'supertest';
import { OpenAPIV3 } from 'openapi-types';

import swaggerSpec from '../../../src/shared/openapi/swagger';
import {
	buildTestApp,
	clearDatabase,
	destroyTestDataSource,
	initializeTestDataSource,
} from '../../helpers/test-helpers';

describe('Contract: OpenAPI', () => {
	beforeAll(async () => {
		await initializeTestDataSource();
	});

	beforeEach(async () => {
		await clearDatabase();
	});

	afterAll(async () => {
		await destroyTestDataSource();
	});

	it('documents the canonical profile endpoints', () => {
		const spec = swaggerSpec as OpenAPIV3.Document;

		expect(spec.paths?.['/profiles']?.post).toBeDefined();
		expect(spec.paths?.['/profiles']?.get).toBeDefined();
		expect(spec.paths?.['/profiles/{profileId}']?.patch).toBeDefined();
		expect(spec.paths?.['/profiles/by-external-id/{externalId}']?.get).toBeDefined();
	});

	it('models Bearer JWT security as the public contract with upstream enforcement notes', () => {
		const spec = swaggerSpec as OpenAPIV3.Document;
		const bearerAuth = spec.components?.securitySchemes?.BearerAuth as
			| OpenAPIV3.HttpSecurityScheme
			| undefined;

		expect(spec.info.description).toContain('Bearer JWT');
		expect(spec.info.description).toContain('API Gateway/BFF');
		expect(spec.info.description).toContain('X-Auth-*');
		expect(bearerAuth).toMatchObject({
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
		});
		expect(bearerAuth?.description).toContain('upstream');
		expect(bearerAuth?.description).toContain('X-Auth-*');
	});

	it('returns an error shape documented by the contract for invalid create requests', async () => {
		const app = buildTestApp();

		const response = await request(app)
			.post('/profiles')
			.set('Idempotency-Key', 'openapi-key')
			.send({
				externalId: 'profile-001',
			});

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			status_code: 400,
			message: 'bad_request',
			errors: [
				{
					code: 'required',
					field: 'X-Idempotency-Key',
					message: 'X-Idempotency-Key header is required for write operations.',
				},
			],
		});
	});

	it('returns a documented 404 error for unknown externalId lookups', async () => {
		const app = buildTestApp();

		const response = await request(app).get('/profiles/by-external-id/not-found');

		expect(response.status).toBe(404);
		expect(response.body.message).toBe('PROFILE_NOT_FOUND');
	});
});
