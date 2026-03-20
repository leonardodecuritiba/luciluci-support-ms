// @ts-expect-error Importing from .js file without type declarations
import { checkAsyncApiBackwardCompatibility } from '../../../scripts/check-asyncapi-backward-compatibility.js';

function buildSpec(overrides?: {
	removeChannel?: boolean;
	removeRequiredStatus?: boolean;
	addOptionalField?: boolean;
}) {
	const dataProperties: Record<string, unknown> = {
		product_id: { type: 'string', format: 'uuid' },
		status: { type: 'string', enum: ['active', 'inactive', 'deleted'] },
	};

	if (overrides?.addOptionalField) {
		dataProperties.display_name = { type: 'string' };
	}

	const dataRequired = ['product_id', 'status'];

	if (overrides?.removeRequiredStatus) {
		delete dataProperties.status;
		dataRequired.splice(dataRequired.indexOf('status'), 1);
	}

	const channels = overrides?.removeChannel
		? {}
		: {
				'products.product.created.v1': {
					address: 'products.product.created.v1',
					messages: {
						productCreated: {
							payload: {
								type: 'object',
								required: ['eventId', 'schemaVersion', 'data', 'headers'],
								properties: {
									eventId: { type: 'string', format: 'uuid' },
									schemaVersion: { type: 'integer', const: 1 },
									headers: {
										type: 'object',
										required: ['X-Correlation-ID'],
										properties: {
											'X-Correlation-ID': { type: 'string', format: 'uuid' },
										},
									},
									data: {
										type: 'object',
										required: dataRequired,
										properties: dataProperties,
									},
								},
							},
						},
					},
				},
			};

	return {
		asyncapi: '3.0.0',
		info: {
			title: 'products events',
			version: '1.0.0',
		},
		channels,
	};
}

describe('AsyncAPI backward compatibility checker', () => {
	it('accepts additive non-breaking changes', () => {
		const baseline = buildSpec();
		const candidate = buildSpec({ addOptionalField: true });

		const result = checkAsyncApiBackwardCompatibility(baseline, candidate);

		expect(result).toEqual({ valid: true, errors: [] });
	});

	it('rejects removed channels from the same major version', () => {
		const baseline = buildSpec();
		const candidate = buildSpec({ removeChannel: true });

		const result = checkAsyncApiBackwardCompatibility(baseline, candidate);

		expect(result.valid).toBe(false);
		expect(result.errors).toEqual(
			expect.arrayContaining([
				"Channel 'products.product.created.v1' was removed from the candidate contract.",
			]),
		);
	});

	it('rejects removed required fields from an existing event payload', () => {
		const baseline = buildSpec();
		const candidate = buildSpec({ removeRequiredStatus: true });

		const result = checkAsyncApiBackwardCompatibility(baseline, candidate);

		expect(result.valid).toBe(false);
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.stringContaining(
					"channels.products.product.created.v1.payload.data: property 'status' was removed.",
				),
				expect.stringContaining(
					"channels.products.product.created.v1.payload.data: required property 'status' became optional or was removed.",
				),
			]),
		);
	});
});
