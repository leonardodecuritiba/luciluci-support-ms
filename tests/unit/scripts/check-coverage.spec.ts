import {
	checkCoverage,
	DEFAULT_THRESHOLDS,
	parseThresholds,
	// @ts-expect-error Importing from .js file without type declarations
} from '../../../scripts/check-coverage.js';

describe('Coverage checker', () => {
	it('accepts summaries that meet the configured thresholds', () => {
		const result = checkCoverage(
			{
				total: {
					lines: { pct: 90 },
					statements: { pct: 88 },
					functions: { pct: 91 },
					branches: { pct: 70 },
				},
			},
			DEFAULT_THRESHOLDS,
		);

		expect(result).toEqual({ valid: true, errors: [] });
	});

	it('rejects summaries below the configured threshold', () => {
		const result = checkCoverage(
			{
				total: {
					lines: { pct: 80 },
					statements: { pct: 84 },
					functions: { pct: 90 },
					branches: { pct: 60 },
				},
			},
			DEFAULT_THRESHOLDS,
		);

		expect(result.valid).toBe(false);
		expect(result.errors).toEqual(
			expect.arrayContaining([
				expect.stringContaining("Coverage for 'lines' is 80.00%"),
				expect.stringContaining("Coverage for 'statements' is 84.00%"),
				expect.stringContaining("Coverage for 'branches' is 60.00%"),
			]),
		);
	});

	it('parses custom thresholds from CLI flags', () => {
		expect(parseThresholds(['--lines=90', '--branches=75'])).toEqual({
			lines: 90,
			statements: 85,
			functions: 85,
			branches: 75,
		});
	});
});
