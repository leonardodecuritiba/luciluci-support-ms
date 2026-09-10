import request from 'supertest';

import Department from '../../../src/features/department/entities/department.entity';
import DepartmentAllowedUser from '../../../src/features/department/entities/department-allowed-user.entity';
import TestDataSource from '../../../src/shared/infrastructure/database/data-source-test';
import {
	buildTestApp,
	clearDatabase,
	destroyTestDataSource,
	initializeTestDataSource,
} from '../../helpers/test-helpers';

const correlationId = '8021b0b0-5855-4c1c-8086-85bba8f4ec94';
const validBody = {
	name: 'Financeiro',
	allowedUserIds: ['uid-user-1', 'uid-user-2'],
	type: 'todos',
};

async function createDepartment(body: object = validBody) {
	return request(buildTestApp())
		.post('/api/support/departments')
		.set('X-Correlation-ID', correlationId)
		.send(body);
}

function patch(id: string, body: unknown, withCorrelation = true) {
	const builder = request(buildTestApp())
		.patch(`/api/support/departments/${id}`)
		.set('Content-Type', 'application/json');
	if (withCorrelation) builder.set('X-Correlation-ID', correlationId);
	return builder.send(body as object);
}

describe('Integration: RF02 update department', () => {
	beforeAll(initializeTestDataSource);
	beforeEach(clearDatabase);
	afterAll(destroyTestDataSource);

	it('updates each field in isolation and returns the complete department', async () => {
		const created = await createDepartment();
		const name = await patch(created.body.id, { name: 'Financeiro Corporativo' });
		expect(name.status).toBe(200);
		expect(name.body).toMatchObject({
			id: created.body.id,
			name: 'Financeiro Corporativo',
			type: 'todos',
			allowedUserIds: validBody.allowedUserIds,
			active: true,
		});

		const type = await patch(created.body.id, { type: 'backoffice' });
		expect(type.status).toBe(200);
		expect(type.body.type).toBe('backoffice');

		const memberships = await patch(created.body.id, {
			allowedUserIds: ['uid-user-2', 'uid-user-2', 'uid-user-3'],
		});
		expect(memberships.status).toBe(200);
		expect(memberships.body.allowedUserIds).toEqual(['uid-user-2', 'uid-user-2', 'uid-user-3']);
		expect(memberships.body.createdAt).toEqual(expect.any(String));
		expect(memberships.body.updatedAt).toEqual(expect.any(String));
		expect(memberships.headers['x-correlation-id']).toBe(correlationId);
	});

	it('updates a combination, preserves omitted fields, and replaces memberships atomically', async () => {
		const created = await createDepartment();
		const response = await patch(created.body.id, {
			name: 'Atendimento',
			allowedUserIds: ['uid-user-3', 'uid-user-1'],
		});

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			name: 'Atendimento',
			type: 'todos',
			allowedUserIds: ['uid-user-3', 'uid-user-1'],
		});
		const rows = await TestDataSource.getRepository(DepartmentAllowedUser).find({
			where: { departmentId: created.body.id },
			order: { position: 'ASC' },
		});
		expect(rows.map((row) => [row.position, row.userId])).toEqual([
			[0, 'uid-user-3'],
			[1, 'uid-user-1'],
		]);
	});

	it('clears memberships with [] and does not touch them when omitted', async () => {
		const created = await createDepartment();
		const omitted = await patch(created.body.id, { name: 'Sem Membership Edit' });
		expect(omitted.body.allowedUserIds).toEqual(validBody.allowedUserIds);

		const cleared = await patch(created.body.id, { allowedUserIds: [] });
		expect(cleared.status).toBe(200);
		expect(cleared.body.allowedUserIds).toEqual([]);
		expect(
			await TestDataSource.getRepository(DepartmentAllowedUser).count({
				where: { departmentId: created.body.id },
			}),
		).toBe(0);
	});

	it('renews updatedAt for an effective change and preserves it for a no-op', async () => {
		const created = await createDepartment();
		const before = created.body.updatedAt;
		const changed = await patch(created.body.id, { allowedUserIds: ['uid-user-9'] });
		expect(changed.body.updatedAt).not.toBe(before);

		const noOp = await patch(created.body.id, {
			name: changed.body.name,
			type: changed.body.type,
			allowedUserIds: changed.body.allowedUserIds,
		});
		expect(noOp.status).toBe(200);
		expect(noOp.body.updatedAt).toBe(changed.body.updatedAt);
	});

	it('edits an inactive department without restoring active', async () => {
		const created = await createDepartment();
		const repository = TestDataSource.getRepository(Department);
		const department = await repository.findOneByOrFail({ id: created.body.id });
		department.active = false;
		await repository.save(department);

		const response = await patch(created.body.id, { name: 'Inativo Editado' });
		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({ name: 'Inativo Editado', active: false });
	});

	it('returns 404 for a valid UUID v4 without a department', async () => {
		const response = await patch('550e8400-e29b-41d4-a716-446655440001', { name: 'Missing' });
		expect(response.status).toBe(404);
		expect(response.body.message).toBe('not_found');
	});

	it('returns 422 for invalid paths, empty body, unknown and non-editable fields', async () => {
		expect((await patch('not-a-uuid', { name: 'Invalid' })).status).toBe(422);
		expect((await patch('550e8400-e29b-41d4-a716-446655440001', {})).status).toBe(422);
		expect(
			(await patch('550e8400-e29b-41d4-a716-446655440001', { active: false })).status,
		).toBe(422);
		expect(
			(await patch('550e8400-e29b-41d4-a716-446655440001', { id: validBody })).status,
		).toBe(422);
		expect(
			(
				await patch('550e8400-e29b-41d4-a716-446655440001', {
					createdAt: '2026-09-10T18:00:00.000Z',
				})
			).status,
		).toBe(422);
		expect(
			(
				await patch('550e8400-e29b-41d4-a716-446655440001', {
					updatedAt: '2026-09-10T18:00:00.000Z',
				})
			).status,
		).toBe(422);
		expect(
			(await patch('550e8400-e29b-41d4-a716-446655440001', { unexpected: true })).status,
		).toBe(422);
		expect((await patch('550e8400-e29b-41d4-a716-446655440001', null)).status).toBe(422);
		expect((await patch('550e8400-e29b-41d4-a716-446655440001', [])).status).toBe(422);
	});

	it.each([
		['blank name', { name: '   ' }],
		['non-string name', { name: 1 }],
		['invalid type', { type: 'admin' }],
		['null name', { name: null }],
		['null type', { type: null }],
		['list is not an array', { allowedUserIds: 'uid-user-1' }],
		['null list', { allowedUserIds: null }],
		['blank list item', { allowedUserIds: [''] }],
		['non-string list item', { allowedUserIds: [1] }],
	])('returns 422 for %s', async (_label, body) => {
		const created = await createDepartment();
		const response = await patch(created.body.id, body);
		expect(response.status).toBe(422);
		expect(response.body.message).toBe('validation_error');
	});

	it('returns 400 without correlation and malformed JSON without side effects', async () => {
		const created = await createDepartment();
		const missingCorrelation = await patch(created.body.id, { name: 'No Correlation' }, false);
		expect(missingCorrelation.status).toBe(400);

		const malformed = await request(buildTestApp())
			.patch(`/api/support/departments/${created.body.id}`)
			.set('X-Correlation-ID', correlationId)
			.set('Content-Type', 'application/json')
			.send('{"name":');
		expect(malformed.status).toBe(400);

		const current = await TestDataSource.getRepository(Department).findOneByOrFail({
			id: created.body.id,
		});
		expect(current.name).toBe(validBody.name);
	});

	it('does not require performed-by or idempotency headers', async () => {
		const created = await createDepartment();
		const response = await patch(created.body.id, { type: 'cd' });
		expect(response.status).toBe(200);
	});
});
