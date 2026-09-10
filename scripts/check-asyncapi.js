const fs = require('node:fs');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const jsonSchemaSubset = {
	type: 'object',
	required: ['type'],
	properties: {
		type: {
			oneOf: [
				{
					type: 'string',
					enum: ['object', 'array', 'string', 'integer', 'number', 'boolean', 'null'],
				},
				{
					type: 'array',
					items: {
						type: 'string',
						enum: ['object', 'array', 'string', 'integer', 'number', 'boolean', 'null'],
					},
					minItems: 1,
					uniqueItems: true,
				},
			],
		},
		format: { type: 'string' },
		enum: { type: 'array' },
		const: true,
		required: {
			type: 'array',
			items: { type: 'string' },
			uniqueItems: true,
		},
		properties: {
			type: 'object',
			additionalProperties: { $ref: '#/$defs/jsonSchemaSubset' },
		},
		items: { $ref: '#/$defs/jsonSchemaSubset' },
	},
	additionalProperties: true,
};

const asyncApiSchema = {
	type: 'object',
	required: ['asyncapi', 'info', 'servers', 'channels'],
	properties: {
		asyncapi: { type: 'string', pattern: '^3\\.' },
		info: {
			type: 'object',
			required: ['title', 'version'],
			properties: {
				title: { type: 'string', minLength: 1 },
				version: { type: 'string', minLength: 1 },
				description: { type: 'string' },
			},
			additionalProperties: true,
		},
		servers: {
			type: 'object',
			minProperties: 1,
			additionalProperties: {
				type: 'object',
				required: ['host', 'protocol'],
				properties: {
					host: { type: 'string', minLength: 1 },
					protocol: { type: 'string', minLength: 1 },
				},
				additionalProperties: true,
			},
		},
		channels: {
			type: 'object',
			minProperties: 1,
			additionalProperties: {
				type: 'object',
				required: ['address', 'messages'],
				properties: {
					address: { type: 'string', minLength: 1 },
					messages: {
						type: 'object',
						minProperties: 1,
						additionalProperties: {
							type: 'object',
							required: ['payload'],
							properties: {
								payload: {
									allOf: [
										{ $ref: '#/$defs/jsonSchemaSubset' },
										{
											type: 'object',
											required: ['type', 'required', 'properties'],
											properties: {
												type: { const: 'object' },
												required: {
													type: 'array',
													contains: { const: 'eventId' },
												},
												properties: {
													type: 'object',
													required: [
														'eventId',
														'correlationId',
														'occurredAt',
													],
													properties: {
														eventId: {
															type: 'object',
															required: ['type', 'format'],
															properties: {
																type: { const: 'string' },
																format: { const: 'uuid' },
															},
															additionalProperties: true,
														},
														schemaVersion: {
															type: 'object',
															required: ['type'],
															properties: {
																type: { const: 'integer' },
															},
															additionalProperties: true,
														},
														correlationId: {
															type: 'object',
															required: ['type', 'format'],
															properties: {
																type: { const: 'string' },
																format: { const: 'uuid' },
															},
															additionalProperties: true,
														},
														occurredAt: {
															type: 'object',
															required: ['type', 'format'],
															properties: {
																type: { const: 'string' },
																format: { const: 'date-time' },
															},
															additionalProperties: true,
														},
														producer: {
															type: 'object',
															required: ['type'],
															properties: {
																type: { const: 'string' },
															},
															additionalProperties: true,
														},
														aggregateId: {
															type: 'object',
															required: ['type', 'format'],
															properties: {
																type: { const: 'string' },
																format: { const: 'uuid' },
															},
															additionalProperties: true,
														},
														headers: {
															type: 'object',
															required: ['type', 'properties'],
															properties: {
																type: { const: 'object' },
																properties: {
																	type: 'object',
																	required: ['X-Correlation-ID'],
																	properties: {
																		'X-Correlation-ID': {
																			type: 'object',
																			required: [
																				'type',
																				'format',
																			],
																			properties: {
																				type: {
																					const: 'string',
																				},
																				format: {
																					const: 'uuid',
																				},
																			},
																			additionalProperties: true,
																		},
																	},
																	additionalProperties: true,
																},
															},
															additionalProperties: true,
														},
														data: { $ref: '#/$defs/jsonSchemaSubset' },
													},
													additionalProperties: true,
												},
											},
											additionalProperties: true,
										},
									],
								},
							},
							additionalProperties: true,
						},
					},
				},
				additionalProperties: true,
			},
		},
	},
	additionalProperties: true,
	$defs: {
		jsonSchemaSubset,
	},
};

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function formatErrors(errors = []) {
	return errors.map((error) => `${error.instancePath || '/'} ${error.message}`);
}

function validateAsyncApiDocument(document) {
	const ajv = new Ajv({ allErrors: true, strict: false });
	addFormats(ajv);
	const validate = ajv.compile(asyncApiSchema);
	const valid = validate(document);

	return {
		valid,
		errors: valid ? [] : formatErrors(validate.errors),
	};
}

function main() {
	const inputPath = process.argv[2];

	if (!inputPath) {
		console.error('Usage: node scripts/check-asyncapi.js <contract.json>');
		process.exit(1);
	}
	const result = validateAsyncApiDocument(readJson(inputPath));

	if (!result.valid) {
		console.error('AsyncAPI validation failed:');
		for (const error of result.errors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}

	console.log('AsyncAPI validation OK');
}

if (require.main === module) {
	main();
}

module.exports = {
	asyncApiSchema,
	checkAsyncApiDocument: validateAsyncApiDocument,
	readJson,
};
