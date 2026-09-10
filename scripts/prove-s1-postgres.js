#!/usr/bin/env node

const assert = require('node:assert/strict');
const net = require('node:net');
const { randomUUID } = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');
const path = require('node:path');
const { Client } = require('pg');

const root = path.resolve(__dirname, '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function required(name) {
	const value = process.env[name];
	if (!value) throw new Error(`Missing required proof environment variable: ${name}`);
	return value;
}

function quotedIdentifier(value) {
	return `"${value.replaceAll('"', '""')}"`;
}

function command(commandName, args, env) {
	const result = spawnSync(commandName, args, {
		cwd: root,
		env,
		encoding: 'utf8',
	});
	if (result.status !== 0) {
		throw new Error(
			`${commandName} ${args.join(' ')} failed (exit ${result.status})\n${result.stdout}\n${result.stderr}`,
		);
	}
}

function waitForPort(port) {
	return new Promise((resolve, reject) => {
		const server = net.createServer();
		server.once('error', reject);
		server.listen(port, '127.0.0.1', () => server.close(resolve));
	});
}

async function fetchEventually(url, predicate, details) {
	const deadline = Date.now() + 30_000;
	let lastError;
	while (Date.now() < deadline) {
		try {
			const response = await fetch(url);
			if (await predicate(response)) return;
			lastError = new Error(`${url} returned ${response.status}`);
		} catch (error) {
			lastError = error;
		}
		await new Promise((resolve) => setTimeout(resolve, 500));
	}
	throw new Error(`Timed out waiting for ${url}: ${lastError?.message ?? details}`);
}

async function stopProcess(child, label) {
	if (child.exitCode !== null) return;
	if (process.platform === 'win32') {
		child.kill('SIGTERM');
	} else {
		process.kill(-child.pid, 'SIGTERM');
	}
	await Promise.race([
		new Promise((resolve) => child.once('exit', resolve)),
		new Promise((resolve) => setTimeout(resolve, 5_000)),
	]);
	if (child.exitCode === null) {
		if (process.platform === 'win32') child.kill('SIGKILL');
		else process.kill(-child.pid, 'SIGKILL');
	}
}

async function smokeProcess(script, childEnv, port) {
	const child = spawn(npmCommand, ['run', script], {
		cwd: root,
		env: childEnv,
		detached: process.platform !== 'win32',
		stdio: ['ignore', 'pipe', 'pipe'],
	});
	let output = '';
	child.stdout.on('data', (chunk) => (output += chunk));
	child.stderr.on('data', (chunk) => (output += chunk));
	try {
		await fetchEventually(
			`http://127.0.0.1:${port}/health`,
			async (response) => {
				if (response.status !== 200) return false;
				const health = await response.json();
				return health.database === true && health.messaging?.status === 'not_applicable';
			},
			'health endpoint',
		);

		await fetchEventually(
			`http://127.0.0.1:${port}/metrics`,
			async (response) => response.status === 200,
			'metrics endpoint',
		);
		const openApiResponse = await fetch(`http://127.0.0.1:${port}/api-docs-json`);
		assert.equal(openApiResponse.status, 200);
		const openApi = await openApiResponse.json();
		assert.deepEqual(Object.keys(openApi.paths).sort(), [
			'/api-docs',
			'/api-docs-json',
			'/health',
			'/metrics',
		]);
		const docsBase = await fetch(`http://127.0.0.1:${port}/api-docs`, {
			redirect: 'manual',
		});
		assert.ok([200, 301, 302, 307, 308].includes(docsBase.status));
		assert.equal((await fetch(`http://127.0.0.1:${port}/api-docs/`)).status, 200);
		console.log(`Swagger statuses for ${script}: /api-docs=${docsBase.status}, /api-docs/=200`);

		const headers = { 'X-Correlation-ID': randomUUID() };
		assert.equal((await fetch(`http://127.0.0.1:${port}/profiles`, { headers })).status, 404);
		assert.equal(
			(await fetch(`http://127.0.0.1:${port}/api/support/tickets`, { headers })).status,
			404,
		);
	} finally {
		await stopProcess(child, script);
	}
	if (child.exitCode && child.exitCode !== 0) {
		throw new Error(`${script} exited before or during smoke test: ${output}`);
	}
}

async function main() {
	const proof = {
		host: required('S1_PROOF_DB_HOST'),
		port: Number(required('S1_PROOF_DB_PORT')),
		user: required('S1_PROOF_DB_USER'),
		password: required('S1_PROOF_DB_PASSWORD'),
		adminDatabase: required('S1_PROOF_ADMIN_DB'),
		database: required('S1_PROOF_DB_NAME'),
		serverPort: Number(required('S1_PROOF_SERVER_PORT')),
	};
	assert.match(proof.database, /^support_s1_(?:proof|ci)_[a-zA-Z0-9_]+$/);
	assert.notEqual(proof.database, 'support_ms');
	assert.ok(Number.isInteger(proof.port) && proof.port > 0);
	assert.ok(Number.isInteger(proof.serverPort) && proof.serverPort > 0);
	await waitForPort(proof.serverPort);

	const admin = new Client({
		host: proof.host,
		port: proof.port,
		user: proof.user,
		password: proof.password,
		database: proof.adminDatabase,
	});
	let databaseCreated = false;
	const proofClients = new Set();
	const proofConnection = {
		host: proof.host,
		port: proof.port,
		user: proof.user,
		password: proof.password,
		database: proof.database,
	};
	async function connectProofClient() {
		const client = new Client(proofConnection);
		await client.connect();
		proofClients.add(client);
		return client;
	}
	async function closeProofClient(client) {
		await client.end();
		proofClients.delete(client);
	}
	try {
		await admin.connect();
		const existing = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [
			proof.database,
		]);
		assert.equal(existing.rowCount, 0, `Proof database already exists: ${proof.database}`);
		await admin.query(`CREATE DATABASE ${quotedIdentifier(proof.database)}`);
		databaseCreated = true;

		const childEnv = {
			...process.env,
			NODE_ENV: 'production',
			DB_HOST: proof.host,
			DB_PORT: String(proof.port),
			DB_USER: proof.user,
			DB_PASSWORD: proof.password,
			DB_NAME: proof.database,
			SERVER_PORT: String(proof.serverPort),
		};
		process.env = childEnv;
		console.log(
			JSON.stringify({
				proofDatabase: proof.database,
				host: proof.host,
				port: proof.port,
				ownership: 'created by proof:s1:postgres',
			}),
		);

		const proofClient = await connectProofClient();
		const identity = await proofClient.query(
			'SELECT current_database(), version(), current_schema(), (SELECT count(*) FROM information_schema.tables WHERE table_schema = current_schema()) AS table_count',
		);
		console.log(
			JSON.stringify({
				database: identity.rows[0].current_database,
				schema: identity.rows[0].current_schema,
				tablesBeforeMigration: identity.rows[0].table_count,
			}),
		);
		assert.equal(identity.rows[0].table_count, '0');
		await closeProofClient(proofClient);

		command(npmCommand, ['run', 'migration:run:dist'], childEnv);
		const catalog = await connectProofClient();
		const tables = (
			await catalog.query(
				'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() ORDER BY table_name',
			)
		).rows.map((row) => row.table_name);
		assert.ok(tables.includes('idempotency_keys'));
		assert.ok(tables.includes('migrations'));
		assert.deepEqual(
			tables.filter((table) =>
				/profile|classification|broker|outbox|department|ticket|message|audit/i.test(table),
			),
			[],
		);
		const columns = (
			await catalog.query(
				"SELECT column_name FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'idempotency_keys' ORDER BY ordinal_position",
			)
		).rows.map((row) => row.column_name);
		assert.deepEqual(columns, [
			'id',
			'key',
			'fingerprint',
			'method',
			'route',
			'correlation_id',
			'state',
			'response_status',
			'response_body',
			'created_at',
			'updated_at',
		]);
		const migrationsBefore = Number(
			(await catalog.query('SELECT count(*) FROM migrations')).rows[0].count,
		);
		assert.equal(migrationsBefore, 1);
		await closeProofClient(catalog);

		command(npmCommand, ['run', 'migration:run:dist'], childEnv);
		const idempotencyDataSource = require(
			path.join(root, 'dist/shared/infrastructure/database/data-source'),
		).default;
		const IdempotencyService = require(
			path.join(root, 'dist/shared/services/idempotency.service'),
		).default;
		await idempotencyDataSource.initialize();
		try {
			const service = new IdempotencyService(idempotencyDataSource);
			const key = `s1-proof-${randomUUID()}`;
			const input = { synthetic: true };
			const first = await service.startRequest(
				key,
				'POST',
				'/synthetic-write',
				input,
				randomUUID(),
			);
			await service.completeRequest(first.context, 201, { resultId: 'synthetic-result' });
			const replay = await service.startRequest(
				key,
				'POST',
				'/synthetic-write',
				input,
				randomUUID(),
			);
			assert.deepEqual(replay.replay, {
				statusCode: 201,
				body: { resultId: 'synthetic-result' },
			});
		} finally {
			await idempotencyDataSource.destroy();
		}
		const afterReplay = await connectProofClient();
		assert.equal(
			Number((await afterReplay.query('SELECT count(*) FROM migrations')).rows[0].count),
			migrationsBefore,
		);
		await closeProofClient(afterReplay);

		await smokeProcess('start', childEnv, proof.serverPort);
		await smokeProcess('start:docker', childEnv, proof.serverPort);
		command(npmCommand, ['run', 'migration:revert:dist'], childEnv);
		const reverted = await connectProofClient();
		assert.equal(
			(
				await reverted.query(
					"SELECT count(*) FROM information_schema.tables WHERE table_schema = current_schema() AND table_name = 'idempotency_keys' ",
				)
			).rows[0].count,
			'0',
		);
		await closeProofClient(reverted);
		command(npmCommand, ['run', 'migration:run:dist'], childEnv);
		command(npmCommand, ['run', 'migration:run'], childEnv);
		console.log('S1 PostgreSQL migration, persistence, and compiled process proof OK');
	} finally {
		await Promise.all([...proofClients].map((client) => client.end()));
		if (databaseCreated) {
			await admin.query(
				'SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()',
				[proof.database],
			);
			await admin.query(`DROP DATABASE ${quotedIdentifier(proof.database)} WITH (FORCE)`);
			console.log(
				JSON.stringify({ proofDatabase: proof.database, cleanup: 'dropped by owner' }),
			);
		}
		await admin.end();
	}
}

main().catch((error) => {
	console.error(error.stack ?? error);
	process.exitCode = 1;
});
