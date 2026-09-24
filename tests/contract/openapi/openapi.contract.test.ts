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

	it('documents operational paths and RF01-RF05', () => {
		const spec = swaggerSpec as OpenAPIV3.Document;

		expect(Object.keys(spec.paths ?? {}).sort()).toEqual([
			'/api-docs',
			'/api-docs-json',
			'/api/support/departments',
			'/api/support/departments/{departmentId}',
			'/api/support/tickets',
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
		expect(updatePath?.delete?.parameters).toEqual([
			{ $ref: '#/components/parameters/CorrelationIdHeader' },
			expect.objectContaining({
				in: 'path',
				name: 'departmentId',
				required: true,
				schema: { type: 'string', format: 'uuid' },
			}),
		]);
		expect(updatePath?.delete?.responses).toEqual(
			expect.objectContaining({
				'204': expect.not.objectContaining({ content: expect.anything() }),
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
		const createTicket = spec.paths?.['/api/support/tickets']?.post;
		expect(createTicket?.parameters).toEqual([
			{ $ref: '#/components/parameters/CorrelationIdHeader' },
		]);
		expect(createTicket?.requestBody).toEqual(
			expect.objectContaining({
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/CreateTicketRequest' },
					},
				},
			}),
		);
		expect(createTicket?.responses).toEqual(
			expect.objectContaining({
				'201': expect.any(Object),
				'400': expect.any(Object),
				'404': expect.any(Object),
				'422': expect.any(Object),
				'500': expect.any(Object),
			}),
		);
		const createTicketSchema = spec.components?.schemas
			?.CreateTicketRequest as OpenAPIV3.SchemaObject;
		expect(createTicketSchema.additionalProperties).toBe(false);
		expect(createTicketSchema.required).toEqual([
			'subject',
			'requesterId',
			'departmentId',
			'priority',
			'origin',
			'message',
		]);
		expect(createTicketSchema.properties?.priority).toEqual({
			$ref: '#/components/schemas/TicketPriority',
		});
		expect(spec.components?.schemas?.TicketPriority).toEqual({
			type: 'string',
			enum: ['baixa', 'media', 'alta', 'urgente'],
		});
		expect(spec.components?.schemas?.TicketOrigin).toEqual({
			type: 'string',
			enum: ['backoffice', 'cd'],
		});
		const initialMessageSchema = spec.components?.schemas
			?.CreateInitialTicketMessageRequest as OpenAPIV3.SchemaObject;
		expect(initialMessageSchema.required).toEqual(['message']);
		expect(initialMessageSchema.properties).toHaveProperty('mediaIds');
		expect(initialMessageSchema.required).not.toContain('mediaIds');
		const ticketSchema = spec.components?.schemas?.Ticket as OpenAPIV3.SchemaObject;
		expect(ticketSchema.additionalProperties).toBe(false);
		expect(ticketSchema.properties).not.toHaveProperty('message');
		expect(ticketSchema.properties).not.toHaveProperty('audit');
		expect(spec.paths?.['/api/support/tickets/{ticketId}']).toBeUndefined();
		expect(spec.info.title).toBe('support-ms');
	});

	it('serves the runtime OpenAPI document without requiring correlation', async () => {
		const response = await request(buildTestApp()).get('/api-docs-json');

		expect(response.status).toBe(200);
		expect(response.headers['x-correlation-id']).toEqual(expect.any(String));
		expect(response.body.paths).toEqual((swaggerSpec as OpenAPIV3.Document).paths);
	});
});
