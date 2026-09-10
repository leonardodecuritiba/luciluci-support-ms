#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const expectedEntrypoints = [
	'main.js',
	'shared/infrastructure/database/run-migrations.js',
	'shared/infrastructure/database/revert-migration.js',
];

function checkDistEntrypoints(distDirectory) {
	const missing = expectedEntrypoints.filter(
		(entrypoint) =>
			!fs.statSync(path.join(distDirectory, entrypoint), { throwIfNoEntry: false })?.isFile(),
	);

	if (missing.length > 0) {
		throw new Error(
			`Compiled production entrypoints are missing from ${distDirectory}: ${missing.join(', ')}`,
		);
	}
}

if (require.main === module) {
	const distDirectory = path.resolve(root, process.argv[2] ?? 'dist');

	try {
		checkDistEntrypoints(distDirectory);
		console.log(`Compiled production entrypoints OK: ${distDirectory}`);
	} catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	}
}

module.exports = { expectedEntrypoints, checkDistEntrypoints };
