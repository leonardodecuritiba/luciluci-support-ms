import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'support-ms',
			version: '1.0.0',
			description:
				'Support OpenAPI contract. RF01–RF04 manage departments and RF05 atomically creates a ticket aggregate; RF06–RF13 remain unavailable until their own contracts are implemented.',
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
				UpdateDepartmentRequest: {
					type: 'object',
					additionalProperties: false,
					minProperties: 1,
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
						active: { type: 'boolean' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				Pagination: {
					type: 'object',
					additionalProperties: false,
					required: ['page', 'size', 'total', 'totalPages'],
					properties: {
						page: { type: 'integer', minimum: 1 },
						size: { type: 'integer', minimum: 1, maximum: 100 },
						total: { type: 'integer', minimum: 0 },
						totalPages: { type: 'integer', minimum: 0 },
					},
				},
				DepartmentListResponse: {
					type: 'object',
					additionalProperties: false,
					required: ['data', 'pagination'],
					properties: {
						data: {
							type: 'array',
							items: { $ref: '#/components/schemas/Department' },
						},
						pagination: { $ref: '#/components/schemas/Pagination' },
					},
				},
				TicketPriority: {
					type: 'string',
					enum: ['baixa', 'media', 'alta', 'urgente'],
				},
				TicketOrigin: { type: 'string', enum: ['backoffice', 'cd'] },
				CreateInitialTicketMessageRequest: {
					type: 'object',
					additionalProperties: false,
					required: ['message'],
					properties: {
						message: { type: 'string', pattern: '.*\\S.*' },
						mediaIds: {
							type: 'array',
							items: { type: 'string', pattern: '.*\\S.*' },
						},
					},
				},
				CreateTicketRequest: {
					type: 'object',
					additionalProperties: false,
					required: [
						'subject',
						'requesterId',
						'departmentId',
						'priority',
						'origin',
						'message',
					],
					properties: {
						subject: { type: 'string', pattern: '.*\\S.*' },
						requesterId: { type: 'string', pattern: '.*\\S.*' },
						departmentId: { type: 'string', format: 'uuid' },
						priority: { $ref: '#/components/schemas/TicketPriority' },
						origin: { $ref: '#/components/schemas/TicketOrigin' },
						message: {
							$ref: '#/components/schemas/CreateInitialTicketMessageRequest',
						},
					},
				},
				Ticket: {
					type: 'object',
					additionalProperties: false,
					required: [
						'id',
						'number',
						'subject',
						'requesterId',
						'departmentId',
						'priority',
						'origin',
						'adminStatus',
						'requesterStatus',
						'createdAt',
						'updatedAt',
					],
					properties: {
						id: { type: 'string', format: 'uuid' },
						number: { type: 'integer', minimum: 1 },
						subject: { type: 'string' },
						requesterId: { type: 'string' },
						departmentId: { type: 'string', format: 'uuid' },
						priority: { $ref: '#/components/schemas/TicketPriority' },
						origin: { $ref: '#/components/schemas/TicketOrigin' },
						adminStatus: { type: 'string', enum: ['pendente'] },
						requesterStatus: { type: 'string', enum: ['nao_resolvido'] },
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
			'/api/support/tickets': {
				post: {
					summary: 'Create a ticket with its initial message',
					description:
						'Atomically creates one Ticket, one initial TicketMessage, zero or more ordered media references, and exactly one criacao_ticket audit. The department row is locked during the transaction; inactive departments return department_inactive.',
					tags: ['Tickets'],
					parameters: [{ $ref: '#/components/parameters/CorrelationIdHeader' }],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CreateTicketRequest' },
							},
						},
					},
					responses: {
						'201': {
							description: 'Ticket aggregate created.',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/Ticket' },
								},
							},
						},
						'400': {
							description: 'Malformed JSON or missing/invalid correlation.',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ErrorResponse' },
								},
							},
						},
						'404': {
							description: 'Department not found.',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ErrorResponse' },
								},
							},
						},
						'422': {
							description:
								'Invalid request body or inactive department (department_inactive).',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ErrorResponse' },
								},
							},
						},
						'500': {
							description: 'Unexpected error; aggregate transaction is rolled back.',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ErrorResponse' },
								},
							},
						},
					},
				},
			},
			'/api/support/departments': {
				get: {
					summary: 'List active departments',
					description:
						'Returns active departments ordered by name ASC and id ASC. Page and size decisions are specific to RF03.',
					tags: ['Departments'],
					parameters: [
						{ $ref: '#/components/parameters/CorrelationIdHeader' },
						{
							in: 'query',
							name: 'type',
							required: false,
							schema: { $ref: '#/components/schemas/DepartmentType' },
						},
						{
							in: 'query',
							name: 'page',
							required: false,
							schema: { type: 'integer', minimum: 1, default: 1 },
						},
						{
							in: 'query',
							name: 'size',
							required: false,
							schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
						},
					],
					responses: {
						'200': {
							description: 'Active departments page.',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/DepartmentListResponse' },
								},
							},
						},
						'400': {
							description: 'Missing or invalid correlation.',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ErrorResponse' },
								},
							},
						},
						'422': {
							description: 'Invalid or unknown query parameter.',
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
			'/api/support/departments/{departmentId}': {
				patch: {
					summary: 'Update a department',
					tags: ['Departments'],
					parameters: [
						{ $ref: '#/components/parameters/CorrelationIdHeader' },
						{
							in: 'path',
							name: 'departmentId',
							required: true,
							schema: { type: 'string', format: 'uuid' },
						},
					],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/UpdateDepartmentRequest' },
							},
						},
					},
					responses: {
						'200': {
							description: 'Department updated.',
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
						'404': {
							description: 'Department not found.',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ErrorResponse' },
								},
							},
						},
						'422': {
							description: 'Invalid path or request body.',
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
				delete: {
					summary: 'Soft delete a department',
					description:
						'Sets active=false while preserving the department and its memberships. Repeating the operation for an inactive department is a successful no-op. RF03 continues to return only active departments. This operation creates no audit log or domain event.',
					tags: ['Departments'],
					parameters: [
						{ $ref: '#/components/parameters/CorrelationIdHeader' },
						{
							in: 'path',
							name: 'departmentId',
							required: true,
							schema: { type: 'string', format: 'uuid' },
						},
					],
					responses: {
						'204': {
							description: 'Department soft deleted or already inactive.',
						},
						'400': {
							description: 'Missing or invalid correlation.',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ErrorResponse' },
								},
							},
						},
						'404': {
							description: 'Department not found.',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ErrorResponse' },
								},
							},
						},
						'422': {
							description: 'Invalid path or forbidden request body.',
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
