import request from 'supertest';
import { OpenAPIV3 } from 'openapi-types';

import swaggerSpec from '../../../src/shared/openapi/swagger';
import {
	buildTestApp,
	destroyTestDataSource,
	initializeTestDataSource,
} from '../../helpers/test-helpers';

describe('Contract: Support bootstrap OpenAPI', () => {
	beforeAll(async () => {
		await initializeTestDataSource();
	});

	afterAll(async () => {
		await destroyTestDataSource();
	});

	it('documents operational paths and RF01-RF03', () => {
		const spec = swaggerSpec as OpenAPIV3.Document;

		expect(Object.keys(spec.paths ?? {}).sort()).toEqual([
			'/api-docs',
			'/api-docs-json',
			'/api/support/departments',
			'/api/support/departments/{departmentId}',
			'/health',
			'/metrics',
		]);
		expect(spec.paths?.['/profiles']).toBeUndefined();
		const listOperation = spec.paths?.['/api/support/departments']?.get;
		expect(listOperation?.parameters).toEqual([
			{ $ref: '#/components/parameters/CorrelationIdHeader' },
			expect.objectContaining({ in: 'query', name: 'type', required: false }),
			expect.objectContaining({
				in: 'query',
				name: 'page',
				schema: expect.objectContaining({ type: 'integer', minimum: 1, default: 1 }),
			}),
			expect.objectContaining({
				in: 'query',
				name: 'size',
				schema: expect.objectContaining({
					type: 'integer',
					minimum: 1,
					maximum: 100,
					default: 20,
				}),
			}),
		]);
		expect(listOperation?.responses).toEqual(
			expect.objectContaining({
				'200': expect.any(Object),
				'400': expect.any(Object),
				'422': expect.any(Object),
				'500': expect.any(Object),
			}),
		);
		expect(spec.paths?.['/api/support/departments']?.post?.parameters).toEqual([
			{ $ref: '#/components/parameters/CorrelationIdHeader' },
		]);
		expect(spec.paths?.['/api/support/departments']?.post?.responses).toEqual(
			expect.objectContaining({
				'201': expect.any(Object),
				'400': expect.any(Object),
				'422': expect.any(Object),
				'500': expect.any(Object),
			}),
		);
		const updatePath = spec.paths?.['/api/support/departments/{departmentId}'];
		expect(updatePath?.patch?.parameters).toEqual([
			{ $ref: '#/components/parameters/CorrelationIdHeader' },
			expect.objectContaining({ in: 'path', name: 'departmentId', required: true }),
		]);
		expect(updatePath?.patch?.responses).toEqual(
			expect.objectContaining({
				'200': expect.any(Object),
				'400': expect.any(Object),
				'404': expect.any(Object),
				'422': expect.any(Object),
				'500': expect.any(Object),
			}),
		);
		expect(spec.components?.schemas?.UpdateDepartmentRequest).toEqual(
			expect.objectContaining({
				additionalProperties: false,
				minProperties: 1,
			}),
		);
		const departmentSchema = spec.components?.schemas?.Department as OpenAPIV3.SchemaObject;
		expect(departmentSchema.properties?.active).toEqual({
			type: 'boolean',
		});
		const paginationSchema = spec.components?.schemas?.Pagination as OpenAPIV3.SchemaObject;
		expect(paginationSchema.required).toEqual(['page', 'size', 'total', 'totalPages']);
		expect(paginationSchema.properties?.size).toEqual({
			type: 'integer',
			minimum: 1,
			maximum: 100,
		});
		expect(paginationSchema.properties).not.toHaveProperty('limit');
		const listSchema = spec.components?.schemas
			?.DepartmentListResponse as OpenAPIV3.SchemaObject;
		expect(listSchema.required).toEqual(['data', 'pagination']);
		expect(spec.info.title).toBe('support-ms');
	});

	it('serves the runtime OpenAPI document without requiring correlation', async () => {
		const response = await request(buildTestApp()).get('/api-docs-json');

		expect(response.status).toBe(200);
		expect(response.headers['x-correlation-id']).toEqual(expect.any(String));
		expect(response.body.paths).toEqual((swaggerSpec as OpenAPIV3.Document).paths);
	});
});
