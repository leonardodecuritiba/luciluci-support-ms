const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function readText(relativePath) {
	return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function main() {
	const identity = JSON.parse(readText('service-identity.json'));
	assert(identity.capabilities?.messaging === false, 'Messaging must be explicitly disabled.');
	assert(
		identity.defaultAsyncApiArtifact === null,
		'AsyncAPI artifact must be null when messaging is disabled.',
	);
	assert(
		Object.keys(identity.defaultRabbitMqExchanges ?? {}).length === 0,
		'No RabbitMQ exchange may remain active when messaging is disabled.',
	);

	for (const relativePath of ['src/main.ts', 'src/app.ts']) {
		const source = readText(relativePath);
		assert(
			!/RabbitMQ|Outbox|ClassificationAssignedConsumer/.test(source),
			relativePath + ' still wires messaging.',
		);
	}

	assert(
		!fs.existsSync(path.join(root, 'src/features/profile')),
		'Profile feature must be absent.',
	);
	assert(
		!fs.existsSync(path.join(root, 'docs/asyncapi/v1')),
		'Active AsyncAPI assets must be absent.',
	);
}

try {
	main();
	console.log('Messaging disabled configuration OK');
} catch (error) {
	console.error('Messaging disabled configuration failed: ' + error.message);
	process.exit(1);
}
