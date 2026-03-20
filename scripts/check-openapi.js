const fs = require('node:fs');
const path = require('node:path');
const SwaggerParser = require('swagger-parser');

async function validateOpenApiDocument(inputPath = 'docs/openapi/v1/products-api.json') {
	const absolutePath = path.resolve(inputPath);
	const rawDocument = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
	await SwaggerParser.validate(rawDocument);

	if (!rawDocument.openapi || !String(rawDocument.openapi).startsWith('3.')) {
		throw new Error('OpenAPI document must declare an OpenAPI 3.x version.');
	}

	if (!rawDocument.info?.title || !rawDocument.info?.version) {
		throw new Error('OpenAPI document must expose info.title and info.version.');
	}

	if (!rawDocument.paths || Object.keys(rawDocument.paths).length === 0) {
		throw new Error('OpenAPI document must expose at least one path.');
	}

	return rawDocument;
}

async function main() {
	const inputPath = process.argv[2] ?? 'docs/openapi/v1/profiles-api.json';
	await validateOpenApiDocument(inputPath);
	console.log('OpenAPI validation OK');
}

if (require.main === module) {
	main().catch((error) => {
		console.error(`OpenAPI validation failed: ${error.message}`);
		process.exit(1);
	});
}

module.exports = {
	validateOpenApiDocument,
};
