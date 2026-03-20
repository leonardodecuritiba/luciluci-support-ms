// @ts-expect-error Importing from .js file without type declarations
import { checkOpenApiBackwardCompatibility } from '../../../scripts/check-openapi-backward-compatibility.js';

function buildSpec(overrides?: {
	removePath?: boolean;
	removeOptionalRequestField?: boolean;
	makeOptionalQueryRequired?: boolean;
	removeResponseField?: boolean;
}) {
	const requestProperties: Record<string, unknown> = {
		name: { type: 'string' },
		slug: { type: 'string' },
	};

	if (overrides?.removeOptionalRequestField) {
		delete requestProperties.slug;
	}

	const getOperation = {
		parameters: [
			{
				in: 'query',
				name: 'status',
				required: Boolean(overrides?.makeOptionalQueryRequired),
				schema: {
					type: 'string',
					enum: ['active', 'inactive'],
				},
			},
		],
		responses: {
			'200': {
				description: 'ok',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							required: ['data'],
							properties: {
								data: {
									type: 'array',
									items: {
										type: 'object',
										required: ['product_id', 'name'],
										properties: {
											product_id: { type: 'string', format: 'uuid' },
											name: { type: 'string' },
										},
									},
								},
							},
						},
					},
				},
			},
		},
	};

	if (overrides?.removeResponseField) {
		const itemSchema = (
			getOperation.responses['200'].content['application/json'].schema.properties.data as {
				items: { properties: Record<string, unknown>; required: string[] };
			}
		).items;
		delete itemSchema.properties.name;
		itemSchema.required = ['product_id'];
	}

	return {
		openapi: '3.0.0',
		info: {
			title: 'products-ms',
			version: '1.0.0',
		},
		paths: overrides?.removePath
			? {}
			: {
					'/products': {
						post: {
							requestBody: {
								required: true,
								content: {
									'application/json': {
										schema: {
											type: 'object',
											required: ['name'],
											properties: requestProperties,
										},
									},
								},
							},
							responses: {
								'201': {
									description: 'created',
									content: {
										'application/json': {
											schema: {
												type: 'object',
												required: ['product_id'],
												properties: {
													product_id: { type: 'string', format: 'uuid' },
												},
											},
										},
									},
								},
							},
						},
						get: getOperation,
					},
				},
	};
}

describe('OpenAPI backward compatibility checker', () => {
	it('accepts additive non-breaking changes', async () => {
		const baseline = buildSpec();
		const candidate = buildSpec();
		const candidateItemProperties = (
			candidate.paths['/products'] as {
				get: {
					responses: {
						'200': {
							content: {
								'application/json': {
									schema: {
										properties: {
											data: {
												items: {
													properties: Record<string, unknown>;
												};
											};
										};
									};
								};
							};
						};
					};
				};
			}
		).get.responses['200'].content['application/json'].schema.properties.data.items.properties;

		candidateItemProperties.display_name = {
			type: 'string',
		};

		const result = await checkOpenApiBackwardCompatibility(baseline, candidate);

		expect(result).toEqual({ valid: true, errors: [] });
	});

	it('rejects removed paths from the same major version', async () => {
		const result = await checkOpenApiBackwardCompatibility(
			buildSpec(),
			buildSpec({ removePath: true }),
		);

		expect(result.valid).toBe(false);
		expect(result.errors).toEqual(
			expect.arrayContaining(["Path '/products' was removed from the candidate contract."]),
		);
	});

	it('rejects request contracts that stop accepting a previously documented field', async () => {
		const result = await checkOpenApiBackwardCompatibility(
			buildSpec(),
			buildSpec({ removeOptionalRequestField: true }),
		);

		expect(result.valid).toBe(false);
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.stringContaining(
					"paths./products.post.requestBody.application/json: property 'slug' was removed.",
				),
			]),
		);
	});

	it('rejects optional query parameters that become required', async () => {
		const result = await checkOpenApiBackwardCompatibility(
			buildSpec(),
			buildSpec({ makeOptionalQueryRequired: true }),
		);

		expect(result.valid).toBe(false);
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.stringContaining(
					"paths./products.get: parameter 'query:status' became required.",
				),
			]),
		);
	});

	it('rejects response schemas that remove previously guaranteed fields', async () => {
		const result = await checkOpenApiBackwardCompatibility(
			buildSpec(),
			buildSpec({ removeResponseField: true }),
		);

		expect(result.valid).toBe(false);
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.stringContaining(
					"paths./products.get.responses.200.application/json.data[]: property 'name' was removed.",
				),
				expect.stringContaining(
					"paths./products.get.responses.200.application/json.data[]: required property 'name' became optional or was removed.",
				),
			]),
		);
	});
});
