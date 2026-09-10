#!/usr/bin/env node

const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { spawnSync } = require('node:child_process');

const proofId = randomUUID().replaceAll('-', '').slice(0, 12);
const network = `support-s1-proof-net-${proofId}`;
const databaseContainer = `support-s1-proof-db-${proofId}`;
const appContainer = `support-s1-proof-app-${proofId}`;
const image = `support-s1-proof-image:${proofId}`;
const database = `support_s1_proof_${proofId}`;
const user = 'support_s1_proof';
const password = `proof_${proofId}`;

function docker(args, allowFailure = false) {
	const result = spawnSync('docker', args, { encoding: 'utf8' });
	if (!allowFailure && result.status !== 0)
		throw new Error(`docker ${args.join(' ')} failed\n${result.stdout}\n${result.stderr}`);
	return result;
}

async function ready(url) {
	const deadline = Date.now() + 45_000;
	let lastError;
	while (Date.now() < deadline) {
		try {
			const response = await fetch(url);
			if (response.status === 200) return response;
			lastError = new Error(`status ${response.status}`);
		} catch (error) {
			lastError = error;
		}
		await new Promise((resolve) => setTimeout(resolve, 500));
	}
	throw new Error(`Image smoke readiness failed: ${lastError?.message}`);
}

async function main() {
	try {
		docker(['version', '--format', '{{.Server.Version}}']);
		docker(['network', 'create', network]);
		docker([
			'run',
			'-d',
			'--name',
			databaseContainer,
			'--network',
			network,
			'-e',
			`POSTGRES_USER=${user}`,
			'-e',
			`POSTGRES_PASSWORD=${password}`,
			'-e',
			`POSTGRES_DB=${database}`,
			'postgres:16',
		]);
		const dbDeadline = Date.now() + 45_000;
		while (Date.now() < dbDeadline) {
			if (
				docker(['exec', databaseContainer, 'pg_isready', '-U', user, '-d', database], true)
					.status === 0
			)
				break;
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
		assert.equal(
			docker(['exec', databaseContainer, 'pg_isready', '-U', user, '-d', database], true)
				.status,
			0,
			'isolated PostgreSQL did not become ready',
		);
		console.log(
			JSON.stringify({
				proofId,
				network,
				databaseContainer,
				database,
				ownership: 'created by proof:s1:image',
			}),
		);
		docker(['build', '--tag', image, '.']);
		docker([
			'run',
			'-d',
			'--name',
			appContainer,
			'--network',
			network,
			'-p',
			'127.0.0.1::3000',
			'-e',
			'NODE_ENV=production',
			'-e',
			'SERVER_PORT=3000',
			'-e',
			'DB_HOST=' + databaseContainer,
			'-e',
			'DB_PORT=5432',
			'-e',
			`DB_USER=${user}`,
			'-e',
			`DB_PASSWORD=${password}`,
			'-e',
			`DB_NAME=${database}`,
			image,
		]);
		const binding = docker(['port', appContainer, '3000/tcp']).stdout.trim();
		const port = binding.match(/:(\d+)$/)?.[1];
		assert.ok(port, `Unable to determine loopback port from ${binding}`);
		const health = await ready(`http://127.0.0.1:${port}/health`);
		const body = await health.json();
		assert.equal(body.database, true);
		assert.equal(body.messaging?.status, 'not_applicable');
		console.log('S1 production image CMD smoke OK');
	} finally {
		docker(['rm', '-f', appContainer], true);
		docker(['rm', '-f', databaseContainer], true);
		docker(['network', 'rm', network], true);
		docker(['image', 'rm', image], true);
		console.log(
			JSON.stringify({
				proofId,
				cleanup: 'removed owned containers, network, and image tag',
			}),
		);
	}
}

main().catch((error) => {
	console.error(error.stack ?? error);
	process.exitCode = 1;
});
