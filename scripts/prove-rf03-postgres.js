#!/usr/bin/env node

const assert = require('node:assert/strict');
const net = require('node:net');
const { randomUUID } = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');
const { Client } = require('pg');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const root = require('node:path').resolve(__dirname, '..');

function required(name) {
	const value = process.env[name];
	if (!value) throw new Error(`Missing required proof environment variable: ${name}`);
	return value;
}

function quoted(value) {
	return `"${value.replaceAll('"', '""')}"`;
}

function run(args, env) {
	const result = spawnSync(npmCommand, args, { cwd: root, env, encoding: 'utf8' });
	if (result.status !== 0) {
		throw new Error(`${args.join(' ')} failed\n${result.stdout}\n${result.stderr}`);
	}
}

function ensurePortFree(port) {
	return new Promise((resolve, reject) => {
		const server = net.createServer();
		server.once('error', reject);
		server.listen(port, '127.0.0.1', () => server.close(resolve));
	});
}

async function stop(child) {
	if (child.exitCode !== null) return;
	try {
		if (process.platform === 'win32') child.kill('SIGTERM');
		else process.kill(-child.pid, 'SIGTERM');
	} catch (error) {
		if (error.code !== 'ESRCH') throw error;
	}
	await Promise.race([
		new Promise((resolve) => child.once('exit', resolve)),
		new Promise((resolve) => setTimeout(resolve, 5_000)),
	]);
	if (child.exitCode === null) {
		try {
			if (process.platform === 'win32') child.kill('SIGKILL');
			else process.kill(-child.pid, 'SIGKILL');
		} catch (error) {
			if (error.code !== 'ESRCH') throw error;
		}
	}
}

async function waitFor(url) {
	const deadline = Date.now() + 30_000;
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
	throw new Error(`Timed out waiting for ${url}: ${lastError?.message}`);
}

async function body(response) {
	return response.json();
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
	await ensurePortFree(proof.serverPort);

	const admin = new Client({
		host: proof.host,
		port: proof.port,
		user: proof.user,
		password: proof.password,
		database: proof.adminDatabase,
	});
	let created = false;
	let inspection;
	let child;
	try {
		await admin.connect();
		assert.equal(
			(await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [proof.database]))
				.rowCount,
			0,
		);
		await admin.query(`CREATE DATABASE ${quoted(proof.database)}`);
		created = true;

		const env = {
			...process.env,
			NODE_ENV: 'production',
			DB_HOST: proof.host,
			DB_PORT: String(proof.port),
			DB_USER: proof.user,
			DB_PASSWORD: proof.password,
			DB_NAME: proof.database,
			SERVER_PORT: String(proof.serverPort),
		};
		const connection = {
			host: proof.host,
			port: proof.port,
			user: proof.user,
			password: proof.password,
			database: proof.database,
		};
		console.log(
			JSON.stringify({
				proofDatabase: proof.database,
				host: proof.host,
				port: proof.port,
				ownership: 'created by proof:rf03:postgres',
			}),
		);

		run(['run', 'migration:run:dist'], env);
		run(['run', 'migration:run:dist'], env);

		inspection = new Client(connection);
		await inspection.connect();
		assert.deepEqual(
			(
				await inspection.query(
					'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() ORDER BY table_name',
				)
			).rows.map((row) => row.table_name),
			[
				'department_allowed_users',
				'departments',
				'idempotency_keys',
				'migrations',
				'ticket_audit_logs',
				'ticket_message_media',
				'ticket_messages',
				'tickets',
			],
		);

		const fixtures = [
			['00000000-0000-4000-8000-000000000003', 'Beta', 'cd', true],
			['00000000-0000-4000-8000-000000000001', 'Alpha', 'todos', true],
			['00000000-0000-4000-8000-000000000002', 'Beta', 'backoffice', true],
			['00000000-0000-4000-8000-000000000004', 'Aardvark', 'cd', false],
		];
		for (const fixture of fixtures) {
			await inspection.query(
				'INSERT INTO departments (id, name, type, active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $5)',
				[...fixture, '2026-09-10T18:00:00.000Z'],
			);
		}
		for (const [position, userId] of [
			[0, 'uid-2'],
			[1, 'uid-2'],
			[2, 'uid-1'],
		]) {
			await inspection.query(
				'INSERT INTO department_allowed_users (department_id, position, user_id) VALUES ($1, $2, $3)',
				['00000000-0000-4000-8000-000000000003', position, userId],
			);
		}

		child = spawn(npmCommand, ['run', 'start'], {
			cwd: root,
			env,
			detached: process.platform !== 'win32',
			stdio: ['ignore', 'pipe', 'pipe'],
		});
		let logs = '';
		child.stdout.on('data', (chunk) => (logs += chunk));
		child.stderr.on('data', (chunk) => (logs += chunk));
		const baseUrl = `http://127.0.0.1:${proof.serverPort}`;
		try {
			assert.equal((await body(await waitFor(`${baseUrl}/health`))).database, true);
			const headers = { 'X-Correlation-ID': randomUUID() };
			const initialRows = await inspection.query(
				'SELECT id, updated_at FROM departments ORDER BY id',
			);

			const defaultResponse = await fetch(`${baseUrl}/api/support/departments`, {
				headers,
			});
			assert.equal(defaultResponse.status, 200);
			const defaultPage = await body(defaultResponse);
			assert.deepEqual(defaultPage.pagination, {
				page: 1,
				size: 20,
				total: 3,
				totalPages: 1,
			});
			assert.deepEqual(
				defaultPage.data.map((item) => item.id),
				[
					'00000000-0000-4000-8000-000000000001',
					'00000000-0000-4000-8000-000000000002',
					'00000000-0000-4000-8000-000000000003',
				],
			);
			assert.deepEqual(defaultPage.data[0].allowedUserIds, []);
			assert.deepEqual(defaultPage.data[2].allowedUserIds, ['uid-2', 'uid-2', 'uid-1']);
			assert.ok(defaultPage.data.every((item) => item.active === true));
			assert.deepEqual(
				Object.keys(defaultPage.data[0]).sort(),
				['id', 'name', 'allowedUserIds', 'type', 'active', 'createdAt', 'updatedAt'].sort(),
			);

			const cdPage = await body(
				await fetch(`${baseUrl}/api/support/departments?type=cd`, { headers }),
			);
			assert.deepEqual(
				cdPage.data.map((item) => item.id),
				['00000000-0000-4000-8000-000000000003'],
			);
			assert.equal(cdPage.pagination.total, 1);

			const pageTwo = await body(
				await fetch(`${baseUrl}/api/support/departments?page=2&size=1`, { headers }),
			);
			assert.equal(pageTwo.data[0].id, '00000000-0000-4000-8000-000000000002');
			assert.deepEqual(pageTwo.pagination, {
				page: 2,
				size: 1,
				total: 3,
				totalPages: 3,
			});

			const beyond = await body(
				await fetch(`${baseUrl}/api/support/departments?page=9&size=1`, { headers }),
			);
			assert.deepEqual(beyond, {
				data: [],
				pagination: { page: 9, size: 1, total: 3, totalPages: 3 },
			});

			for (const query of ['page=0', 'page=1.5', 'size=101', 'type=invalid', 'limit=20']) {
				assert.equal(
					(await fetch(`${baseUrl}/api/support/departments?${query}`, { headers }))
						.status,
					422,
				);
			}
			assert.equal((await fetch(`${baseUrl}/api/support/departments`)).status, 400);
			assert.deepEqual(
				(await inspection.query('SELECT id, updated_at FROM departments ORDER BY id')).rows,
				initialRows.rows,
			);

			const post = await fetch(`${baseUrl}/api/support/departments`, {
				method: 'POST',
				headers: { ...headers, 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: 'Gamma', type: 'todos', allowedUserIds: [] }),
			});
			assert.equal(post.status, 201);
			const createdDepartment = await body(post);
			const patch = await fetch(
				`${baseUrl}/api/support/departments/${createdDepartment.id}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						'X-Correlation-ID': randomUUID(),
					},
					body: JSON.stringify({ type: 'backoffice' }),
				},
			);
			assert.equal(patch.status, 200);
			assert.equal((await body(patch)).type, 'backoffice');

			const spec = await body(await fetch(`${baseUrl}/api-docs-json`));
			assert.ok(spec.paths['/api/support/departments']?.get);
			assert.equal(spec.components.schemas.Pagination.properties.size.maximum, 100);
			assert.equal((await fetch(`${baseUrl}/api-docs`)).status, 200);

			const pendingRoutes = [
				['DELETE', `/api/support/departments/${randomUUID()}`],
				['GET', `/api/support/tickets/${randomUUID()}`],
				['POST', `/api/support/tickets/${randomUUID()}/messages`],
				[
					'PATCH',
					`/api/support/tickets/${randomUUID()}/messages/${randomUUID()}/visibility`,
				],
				['GET', `/api/support/tickets/${randomUUID()}/messages`],
				['GET', '/api/support/tickets/history'],
			];
			for (const [method, path] of pendingRoutes) {
				assert.equal(
					(await fetch(`${baseUrl}${path}`, { method, headers })).status,
					404,
					`${method} ${path} must remain unavailable`,
				);
			}
		} finally {
			const exitCode = child.exitCode;
			await stop(child);
			child = undefined;
			if (exitCode !== null && exitCode !== 0) {
				throw new Error(`Compiled process exited unexpectedly: ${logs}`);
			}
		}

		console.log('RF03 PostgreSQL pagination, ordering, and compiled process proof OK');
	} finally {
		if (child) await stop(child);
		if (inspection) await inspection.end().catch(() => undefined);
		if (created) {
			await admin.query(
				'SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()',
				[proof.database],
			);
			await admin.query(`DROP DATABASE ${quoted(proof.database)} WITH (FORCE)`);
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
