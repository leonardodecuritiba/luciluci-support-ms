const fs = require('node:fs');
const path = require('node:path');
const prettier = require('prettier');

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

async function exportOpenApi(outputPath = 'docs/openapi/v1/profiles-api.json') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const swaggerSpec = require('../src/shared/openapi/swagger').default;
	const absoluteOutputPath = path.resolve(outputPath);
	const normalizedSpec = sortRecursively(swaggerSpec);
	const prettierConfig = (await prettier.resolveConfig(absoluteOutputPath)) ?? {};
	const formattedSpec = await prettier.format(JSON.stringify(normalizedSpec), {
		...prettierConfig,
		parser: 'json',
	});

	fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });
	fs.writeFileSync(
		absoluteOutputPath,
		formattedSpec.endsWith('\n') ? formattedSpec : `${formattedSpec}\n`,
	);

	return absoluteOutputPath;
}

async function main() {
	const outputPath = process.argv[2];
	const exportedPath = await exportOpenApi(outputPath);
	console.log(`OpenAPI exported to ${exportedPath}`);
}

if (require.main === module) {
	main().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}

module.exports = {
	exportOpenApi,
	sortRecursively,
};
