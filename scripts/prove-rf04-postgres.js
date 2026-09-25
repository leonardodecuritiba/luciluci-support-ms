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

async function withTimeout(promise, label) {
	let timeout;
	try {
		return await Promise.race([
			promise,
			new Promise((_, reject) => {
				timeout = setTimeout(() => reject(new Error(`${label} timed out`)), 10_000);
			}),
		]);
	} finally {
		clearTimeout(timeout);
	}
}

async function json(response) {
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
	let child;
	let inspection;
	let lockClient;
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
				ownership: 'created by proof:rf04:postgres',
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
			assert.equal((await json(await waitFor(`${baseUrl}/health`))).database, true);
			const createResponse = await fetch(`${baseUrl}/api/support/departments`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Correlation-ID': randomUUID(),
				},
				body: JSON.stringify({
					name: 'Financeiro RF04',
					type: 'todos',
					allowedUserIds: ['uid-2', 'uid-2', 'uid-1'],
				}),
			});
			assert.equal(createResponse.status, 201);
			const department = await json(createResponse);
			const oldUpdatedAt = new Date('2026-09-10T18:05:00.000Z');
			await inspection.query('UPDATE departments SET updated_at = $1 WHERE id = $2', [
				oldUpdatedAt,
				department.id,
			]);

			const before = (
				await inspection.query(
					'SELECT id, name, type, active, created_at, updated_at FROM departments WHERE id = $1',
					[department.id],
				)
			).rows[0];
			const membershipsBefore = (
				await inspection.query(
					'SELECT position, user_id FROM department_allowed_users WHERE department_id = $1 ORDER BY position',
					[department.id],
				)
			).rows;
			assert.deepEqual(
				membershipsBefore.map((membership) => [membership.position, membership.user_id]),
				[
					[0, 'uid-2'],
					[1, 'uid-2'],
					[2, 'uid-1'],
				],
			);

			const deleteResponse = await fetch(
				`${baseUrl}/api/support/departments/${department.id}`,
				{
					method: 'DELETE',
					headers: { 'X-Correlation-ID': randomUUID() },
				},
			);
			assert.equal(deleteResponse.status, 204);
			assert.equal(await deleteResponse.text(), '');
			const deleted = (
				await inspection.query(
					'SELECT id, name, type, active, created_at, updated_at FROM departments WHERE id = $1',
					[department.id],
				)
			).rows[0];
			assert.deepEqual(
				[
					deleted.id,
					deleted.name,
					deleted.type,
					deleted.active,
					deleted.created_at.toISOString(),
				],
				[before.id, before.name, before.type, false, before.created_at.toISOString()],
			);
			assert.ok(deleted.updated_at.getTime() > oldUpdatedAt.getTime());
			assert.deepEqual(
				(
					await inspection.query(
						'SELECT position, user_id FROM department_allowed_users WHERE department_id = $1 ORDER BY position',
						[department.id],
					)
				).rows,
				membershipsBefore,
			);

			const deleteTimestamp = deleted.updated_at.toISOString();
			const repeated = await fetch(`${baseUrl}/api/support/departments/${department.id}`, {
				method: 'DELETE',
				headers: { 'X-Correlation-ID': randomUUID() },
			});
			assert.equal(repeated.status, 204);
			assert.equal(
				(
					await inspection.query('SELECT updated_at FROM departments WHERE id = $1', [
						department.id,
					])
				).rows[0].updated_at.toISOString(),
				deleteTimestamp,
			);

			const listed = await json(
				await fetch(`${baseUrl}/api/support/departments`, {
					headers: { 'X-Correlation-ID': randomUUID() },
				}),
			);
			assert.deepEqual(listed, {
				data: [],
				pagination: { page: 1, size: 20, total: 0, totalPages: 0 },
			});

			assert.equal(
				(
					await fetch(`${baseUrl}/api/support/departments/not-a-uuid`, {
						method: 'DELETE',
						headers: { 'X-Correlation-ID': randomUUID() },
					})
				).status,
				422,
			);
			assert.equal(
				(
					await fetch(`${baseUrl}/api/support/departments/${randomUUID()}`, {
						method: 'DELETE',
						headers: { 'X-Correlation-ID': randomUUID() },
					})
				).status,
				404,
			);
			assert.equal(
				(
					await fetch(`${baseUrl}/api/support/departments/${department.id}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							'X-Correlation-ID': randomUUID(),
						},
						body: '{}',
					})
				).status,
				422,
			);
			assert.equal(
				(
					await fetch(`${baseUrl}/api/support/departments/${department.id}`, {
						method: 'DELETE',
					})
				).status,
				400,
			);
			assert.equal(
				(
					await fetch(`${baseUrl}/api/support/departments/${department.id}`, {
						method: 'DELETE',
						headers: { 'X-Correlation-ID': 'invalid' },
					})
				).status,
				400,
			);

			const concurrentCreate = await fetch(`${baseUrl}/api/support/departments`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Correlation-ID': randomUUID(),
				},
				body: JSON.stringify({
					name: 'Concorrente',
					type: 'backoffice',
					allowedUserIds: ['uid-a', 'uid-a', 'uid-b'],
				}),
			});
			assert.equal(concurrentCreate.status, 201);
			const concurrentDepartment = await json(concurrentCreate);
			lockClient = new Client(connection);
			await lockClient.connect();
			await lockClient.query('BEGIN');
			await lockClient.query('SELECT id FROM departments WHERE id = $1 FOR UPDATE', [
				concurrentDepartment.id,
			]);
			let patchCompleted = false;
			let deleteCompleted = false;
			const patchPromise = fetch(
				`${baseUrl}/api/support/departments/${concurrentDepartment.id}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						'X-Correlation-ID': randomUUID(),
					},
					body: JSON.stringify({ name: 'Concorrente Atualizado' }),
				},
			).then((response) => {
				patchCompleted = true;
				return response;
			});
			const deletePromise = fetch(
				`${baseUrl}/api/support/departments/${concurrentDepartment.id}`,
				{
					method: 'DELETE',
					headers: { 'X-Correlation-ID': randomUUID() },
				},
			).then((response) => {
				deleteCompleted = true;
				return response;
			});
			await new Promise((resolve) => setTimeout(resolve, 150));
			assert.equal(patchCompleted, false);
			assert.equal(deleteCompleted, false);
			await lockClient.query('COMMIT');
			await lockClient.end();
			lockClient = undefined;
			const [patchResponse, concurrentDeleteResponse] = await withTimeout(
				Promise.all([patchPromise, deletePromise]),
				'RF02/RF04 concurrent requests',
			);
			assert.equal(patchResponse.status, 200);
			assert.equal(concurrentDeleteResponse.status, 204);
			const concurrentRow = (
				await inspection.query('SELECT name, active FROM departments WHERE id = $1', [
					concurrentDepartment.id,
				])
			).rows[0];
			assert.deepEqual(
				[concurrentRow.name, concurrentRow.active],
				['Concorrente Atualizado', false],
			);
			assert.deepEqual(
				(
					await inspection.query(
						'SELECT position, user_id FROM department_allowed_users WHERE department_id = $1 ORDER BY position',
						[concurrentDepartment.id],
					)
				).rows.map((membership) => [membership.position, membership.user_id]),
				[
					[0, 'uid-a'],
					[1, 'uid-a'],
					[2, 'uid-b'],
				],
			);

			const spec = await json(await fetch(`${baseUrl}/api-docs-json`));
			const deleteContract = spec.paths['/api/support/departments/{departmentId}']?.delete;
			assert.ok(deleteContract);
			assert.ok(deleteContract.responses['204']);
			assert.equal(deleteContract.responses['204'].content, undefined);
			assert.equal((await fetch(`${baseUrl}/api-docs`)).status, 200);
			assert.equal(
				(await inspection.query('SELECT count(*) FROM idempotency_keys')).rows[0].count,
				'0',
			);

			const pendingRoutes = [
				[
					'PATCH',
					`/api/support/tickets/${randomUUID()}/messages/${randomUUID()}/visibility`,
				],
				['GET', `/api/support/tickets/${randomUUID()}/messages`],
				['GET', '/api/support/tickets/history'],
			];
			for (const [method, path] of pendingRoutes) {
				assert.equal(
					(
						await fetch(`${baseUrl}${path}`, {
							method,
							headers: { 'X-Correlation-ID': randomUUID() },
						})
					).status,
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

		console.log(
			'RF04 PostgreSQL soft delete, no-op, RF03 regression, locking, and compiled process proof OK',
		);
	} finally {
		if (child) await stop(child);
		if (lockClient) {
			await lockClient.query('ROLLBACK').catch(() => undefined);
			await lockClient.end().catch(() => undefined);
		}
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
