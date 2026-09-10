import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'support-ms',
			version: '1.0.0',
			description:
				'Support OpenAPI contract. RF01 creates departments; RF02–RF13 remain unavailable until their own contracts are implemented.',
		},
		components: {
			parameters: {
				CorrelationIdHeader: {
					in: 'header',
					name: 'X-Correlation-ID',
					required: true,
					schema: { type: 'string', format: 'uuid' },
				},
			},
			schemas: {
				DepartmentType: { type: 'string', enum: ['todos', 'backoffice', 'cd'] },
				CreateDepartmentRequest: {
					type: 'object',
					additionalProperties: false,
					required: ['name', 'type'],
					properties: {
						name: { type: 'string', pattern: '.*\\S.*' },
						allowedUserIds: {
							type: 'array',
							items: { type: 'string', pattern: '.*\\S.*' },
						},
						type: { $ref: '#/components/schemas/DepartmentType' },
					},
				},
				Department: {
					type: 'object',
					required: [
						'id',
						'name',
						'allowedUserIds',
						'type',
						'active',
						'createdAt',
						'updatedAt',
					],
					properties: {
						id: { type: 'string', format: 'uuid' },
						name: { type: 'string' },
						allowedUserIds: { type: 'array', items: { type: 'string' } },
						type: { $ref: '#/components/schemas/DepartmentType' },
						active: { type: 'boolean', enum: [true] },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				ErrorResponse: {
					type: 'object',
					required: ['status_code', 'message'],
					properties: {
						status_code: { type: 'integer' },
						message: { type: 'string' },
						errors: { type: 'array', items: { type: 'object' } },
					},
				},
			},
		},
		paths: {
			'/api/support/departments': {
				post: {
					summary: 'Create a department',
					tags: ['Departments'],
					parameters: [{ $ref: '#/components/parameters/CorrelationIdHeader' }],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CreateDepartmentRequest' },
							},
						},
					},
					responses: {
						'201': {
							description: 'Department created.',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/Department' },
								},
							},
						},
						'400': {
							description: 'Malformed JSON or missing correlation.',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ErrorResponse' },
								},
							},
						},
						'422': {
							description: 'Invalid request body.',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ErrorResponse' },
								},
							},
						},
						'500': {
							description: 'Unexpected error.',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ErrorResponse' },
								},
							},
						},
					},
				},
			},
			'/health': {
				get: {
					summary: 'Service health',
					responses: {
						'200': {
							description: 'Operational health status.',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										required: ['status', 'timestamp', 'database', 'messaging'],
										properties: {
											status: { type: 'string', enum: ['ok'] },
											timestamp: { type: 'string', format: 'date-time' },
											database: { type: 'boolean' },
											messaging: {
												type: 'object',
												required: ['enabled', 'status'],
												properties: {
													enabled: { type: 'boolean', enum: [false] },
													status: {
														type: 'string',
														enum: ['not_applicable'],
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
			'/metrics': {
				get: {
					summary: 'Prometheus metrics',
					responses: {
						'200': {
							description: 'Prometheus exposition format.',
							content: { 'text/plain': { schema: { type: 'string' } } },
						},
					},
				},
			},
			'/api-docs-json': {
				get: {
					summary: 'OpenAPI document',
					responses: {
						'200': {
							description: 'Current OpenAPI document.',
							content: { 'application/json': { schema: { type: 'object' } } },
						},
					},
				},
			},
			'/api-docs': {
				get: {
					summary: 'Swagger UI',
					responses: {
						'200': {
							description: 'Interactive OpenAPI documentation.',
							content: { 'text/html': { schema: { type: 'string' } } },
						},
					},
				},
			},
		},
	},
	apis: [],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
