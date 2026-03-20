const fs = require('node:fs');

const DEFAULT_THRESHOLDS = {
	lines: 85,
	statements: 85,
	functions: 85,
	branches: 65,
};

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseThresholds(argv) {
	return argv.reduce(
		(thresholds, argument) => {
			if (!argument.startsWith('--')) {
				return thresholds;
			}

			const [rawKey, rawValue] = argument.slice(2).split('=');
			const value = Number(rawValue);

			if (
				(rawKey === 'lines' ||
					rawKey === 'statements' ||
					rawKey === 'functions' ||
					rawKey === 'branches') &&
				!Number.isNaN(value)
			) {
				thresholds[rawKey] = value;
			}

			return thresholds;
		},
		{ ...DEFAULT_THRESHOLDS },
	);
}

function checkCoverage(summary, thresholds) {
	const errors = [];
	const totalCoverage = summary.total ?? {};

	for (const [metricName, threshold] of Object.entries(thresholds)) {
		const actual = totalCoverage[metricName]?.pct;

		if (typeof actual !== 'number') {
			errors.push(`Coverage metric '${metricName}' is missing from the summary.`);
			continue;
		}

		if (actual < threshold) {
			errors.push(
				`Coverage for '${metricName}' is ${actual.toFixed(2)}%, below the required ${threshold.toFixed(2)}%.`,
			);
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

function main() {
	const [summaryPath, ...flags] = process.argv.slice(2);

	if (!summaryPath) {
		console.error(
			'Usage: node scripts/check-coverage.js <coverage-summary.json> [--lines=85 --statements=85 --functions=85 --branches=65]',
		);
		process.exit(1);
	}

	const result = checkCoverage(readJson(summaryPath), parseThresholds(flags));

	if (!result.valid) {
		console.error('Coverage check failed:');
		for (const error of result.errors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}

	console.log('Coverage thresholds OK');
}

if (require.main === module) {
	main();
}

module.exports = {
	DEFAULT_THRESHOLDS,
	checkCoverage,
	parseThresholds,
	readJson,
};
