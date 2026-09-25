import request from 'supertest';

import DepartmentTypeormRepository from '../../../src/features/department/adapters/repositories/department-typeorm.repository';
import Department from '../../../src/features/department/entities/department.entity';
import DepartmentAllowedUser from '../../../src/features/department/entities/department-allowed-user.entity';
import DepartmentType from '../../../src/features/department/entities/enums/department-type.enum';
import IdempotencyKey from '../../../src/shared/entities/idempotency-key.entity';
import TestDataSource from '../../../src/shared/infrastructure/database/data-source-test';
import {
	buildTestApp,
	clearDatabase,
	destroyTestDataSource,
	initializeTestDataSource,
} from '../../helpers/test-helpers';

const correlationId = '8021b0b0-5855-4c1c-8086-85bba8f4ec94';
const departmentId = '00000000-0000-4000-8000-000000000001';
const missingId = '00000000-0000-4000-8000-000000000002';
const createdAt = new Date('2026-09-10T18:00:00.000Z');
const updatedAt = new Date('2026-09-10T18:05:00.000Z');
const memberships = ['uid-2', 'uid-2', 'uid-1'];

async function insertDepartment(active = true) {
	await TestDataSource.getRepository(Department).insert({
		id: departmentId,
		name: 'Financeiro',
		type: DepartmentType.Todos,
		active,
		createdAt,
		updatedAt,
	});
	await TestDataSource.getRepository(DepartmentAllowedUser).insert(
		memberships.map((userId, position) => ({ departmentId, position, userId })),
	);
}

function remove(id = departmentId, withCorrelation = true) {
	const builder = request(buildTestApp()).delete(`/api/support/departments/${id}`);
	if (withCorrelation) builder.set('X-Correlation-ID', correlationId);
	return builder;
}

async function readMemberships() {
	return TestDataSource.getRepository(DepartmentAllowedUser).find({
		where: { departmentId },
		order: { position: 'ASC' },
	});
}

describe('Integration: RF04 delete department', () => {
	beforeAll(initializeTestDataSource);
	beforeEach(clearDatabase);
	afterAll(destroyTestDataSource);

	it('soft deletes with 204 while preserving the row, fields, and ordered memberships', async () => {
		await insertDepartment();
		const membershipsBefore = await readMemberships();

		const response = await remove();

		expect(response.status).toBe(204);
		expect(response.text).toBe('');
		expect(response.headers['x-correlation-id']).toBe(correlationId);
		const row = await TestDataSource.getRepository(Department).findOneByOrFail({
			id: departmentId,
		});
		expect(row).toMatchObject({
			id: departmentId,
			name: 'Financeiro',
			type: DepartmentType.Todos,
			active: false,
			createdAt,
		});
		expect(row.updatedAt.getTime()).toBeGreaterThan(updatedAt.getTime());
		expect(await readMemberships()).toEqual(membershipsBefore);
		expect(await TestDataSource.getRepository(IdempotencyKey).count()).toBe(0);
	});

	it('is a no-op for an inactive department and preserves updatedAt and memberships', async () => {
		await insertDepartment(false);
		const membershipsBefore = await readMemberships();

		expect((await remove()).status).toBe(204);
		const afterFirst = await TestDataSource.getRepository(Department).findOneByOrFail({
			id: departmentId,
		});
		expect(afterFirst.updatedAt).toEqual(updatedAt);
		expect((await remove()).status).toBe(204);
		const afterSecond = await TestDataSource.getRepository(Department).findOneByOrFail({
			id: departmentId,
		});
		expect(afterSecond.updatedAt).toEqual(updatedAt);
		expect(await readMemberships()).toEqual(membershipsBefore);
	});

	it('removes the department from RF03 data and total without deleting it', async () => {
		await insertDepartment();
		const before = await request(buildTestApp())
			.get('/api/support/departments')
			.set('X-Correlation-ID', correlationId);
		expect(before.body.pagination.total).toBe(1);

		expect((await remove()).status).toBe(204);
		const after = await request(buildTestApp())
			.get('/api/support/departments')
			.set('X-Correlation-ID', correlationId);
		expect(after.body).toEqual({
			data: [],
			pagination: { page: 1, size: 20, total: 0, totalPages: 0 },
		});
		expect(await TestDataSource.getRepository(Department).count()).toBe(1);
	});

	it('returns the frozen errors for invalid input without side effects', async () => {
		await insertDepartment();
		expect((await remove('not-a-uuid')).status).toBe(422);
		expect((await remove(missingId)).status).toBe(404);
		expect((await remove(departmentId, false)).status).toBe(400);
		const invalidCorrelation = await request(buildTestApp())
			.delete(`/api/support/departments/${departmentId}`)
			.set('X-Correlation-ID', 'not-a-uuid');
		expect(invalidCorrelation.status).toBe(400);
		const withBody = await request(buildTestApp())
			.delete(`/api/support/departments/${departmentId}`)
			.set('X-Correlation-ID', correlationId)
			.send({ unexpected: true });
		expect(withBody.status).toBe(422);

		const row = await TestDataSource.getRepository(Department).findOneByOrFail({
			id: departmentId,
		});
		expect(row.active).toBe(true);
		expect(row.updatedAt).toEqual(updatedAt);
		expect((await readMemberships()).map((membership) => membership.userId)).toEqual(
			memberships,
		);
	});

	it('maps an unexpected persistence failure to 500 and rolls back', async () => {
		await insertDepartment();
		const update = jest
			.spyOn(DepartmentTypeormRepository.prototype, 'update')
			.mockRejectedValueOnce(new Error('injected failure'));

		const response = await remove();

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ status_code: 500, message: 'internal_error' });
		expect(
			(await TestDataSource.getRepository(Department).findOneByOrFail({ id: departmentId }))
				.active,
		).toBe(true);
		update.mockRestore();
	});

	it('does not materialize side-effect tables and keeps RF10-RF13 unavailable', async () => {
		await insertDepartment();
		expect((await remove()).status).toBe(204);
		const tables = (
			await TestDataSource.query(
				"SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
			)
		).map((row: { name: string }) => row.name);
		expect(tables).not.toEqual(expect.arrayContaining(['audit_logs', 'outbox_events']));

		const futureRoutes: Array<['get' | 'post' | 'patch', string]> = [
			['get', '/api/support/tickets/00000000-0000-4000-8000-000000000010/messages'],
			['get', '/api/support/tickets/history'],
		];
		for (const [method, path] of futureRoutes) {
			const response = await request(buildTestApp())
				[method](path)
				.set('X-Correlation-ID', correlationId);
			expect(response.status).toBe(404);
		}
	});
});
