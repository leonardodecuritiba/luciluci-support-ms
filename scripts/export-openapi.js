const fs = require('node:fs');
const path = require('node:path');

function sortRecursively(value) {
	if (Array.isArray(value)) {
		return value.map((item) => sortRecursively(item));
	}

	if (!value || typeof value !== 'object') {
		return value;
	}

	return Object.keys(value)
		.sort((left, right) => left.localeCompare(right))
		.reduce((sorted, key) => {
			sorted[key] = sortRecursively(value[key]);
			return sorted;
		}, {});
}

function exportOpenApi(outputPath = 'docs/openapi/v1/profiles-api.json') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const swaggerSpec = require('../src/shared/openapi/swagger').default;
	const absoluteOutputPath = path.resolve(outputPath);
	const normalizedSpec = sortRecursively(swaggerSpec);

	fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });
	fs.writeFileSync(absoluteOutputPath, `${JSON.stringify(normalizedSpec, null, 2)}\n`);

	return absoluteOutputPath;
}

function main() {
	const outputPath = process.argv[2];
	const exportedPath = exportOpenApi(outputPath);
	console.log(`OpenAPI exported to ${exportedPath}`);
}

if (require.main === module) {
	main();
}

module.exports = {
	exportOpenApi,
	sortRecursively,
};
