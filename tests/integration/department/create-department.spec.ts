import request from 'supertest';
import TestDataSource from '../../../src/shared/infrastructure/database/data-source-test';
import Department from '../../../src/features/department/entities/department.entity';
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
const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function post(body: object) {
	return request(buildTestApp())
		.post('/api/support/departments')
		.set('X-Correlation-ID', correlationId)
		.send(body);
}

describe('Integration: RF01 create department', () => {
	beforeAll(initializeTestDataSource);
	beforeEach(clearDatabase);
	afterAll(destroyTestDataSource);

	it('creates a department without performed-by or idempotency headers', async () => {
		const response = await post(validBody);

		expect(response.status).toBe(201);
		expect(response.body.id).toMatch(uuidV4);
		expect(response.body).toMatchObject({ ...validBody, active: true });
		expect(response.body.createdAt).toEqual(expect.any(String));
		expect(response.body.updatedAt).toEqual(expect.any(String));
		expect(response.headers['x-correlation-id']).toBe(correlationId);
	});

	it('defaults omitted allowedUserIds and persists an empty relational list', async () => {
		const response = await post({ name: 'Operações', type: 'cd' });
		expect(response.status).toBe(201);
		expect(response.body.allowedUserIds).toEqual([]);
		const department = await TestDataSource.getRepository(Department).findOne({
			where: { id: response.body.id },
			relations: { allowedUsers: true },
		});
		expect(department?.allowedUsers).toEqual([]);
	});

	it('accepts an explicit empty allowedUserIds list', async () => {
		const response = await post({
			name: 'Atendimento',
			allowedUserIds: [],
			type: 'backoffice',
		});
		expect(response.status).toBe(201);
		expect(response.body.allowedUserIds).toEqual([]);
	});

	it('accepts repeated names and produces independent IDs', async () => {
		const first = await post(validBody);
		const second = await post(validBody);
		expect(first.status).toBe(201);
		expect(second.status).toBe(201);
		expect(second.body.id).not.toBe(first.body.id);
	});

	it('rejects missing correlation before creating a department', async () => {
		const response = await request(buildTestApp())
			.post('/api/support/departments')
			.send(validBody);
		expect(response.status).toBe(400);
		expect(response.body.message).toBe('bad_request');
		expect(await TestDataSource.getRepository(Department).count()).toBe(0);
	});

	it.each([
		['missing name', { type: 'todos' }],
		['non-string name', { ...validBody, name: 1 }],
		['blank name', { ...validBody, name: '   ' }],
		['missing type', { name: 'Financeiro' }],
		['invalid type', { ...validBody, type: 'admin' }],
		['allowedUserIds is not an array', { ...validBody, allowedUserIds: 'uid-user-1' }],
		['allowedUserIds item is blank', { ...validBody, allowedUserIds: [''] }],
		['allowedUserIds item is not a string', { ...validBody, allowedUserIds: [1] }],
		['unknown field', { ...validBody, unexpected: true }],
		['generated id', { ...validBody, id: 'attempted-id' }],
		['generated active', { ...validBody, active: false }],
		['generated createdAt', { ...validBody, createdAt: '2026-09-10T18:00:00.000Z' }],
		['generated updatedAt', { ...validBody, updatedAt: '2026-09-10T18:00:00.000Z' }],
	])('returns 422 for %s', async (_label, body) => {
		const response = await post(body);
		expect(response.status).toBe(422);
		expect(response.body.message).toBe('validation_error');
	});

	it('returns 400 for malformed JSON', async () => {
		const response = await request(buildTestApp())
			.post('/api/support/departments')
			.set('X-Correlation-ID', correlationId)
			.set('Content-Type', 'application/json')
			.send('{"name":');
		expect(response.status).toBe(400);
		expect(response.body.message).toBe('bad_request');
	});
});
