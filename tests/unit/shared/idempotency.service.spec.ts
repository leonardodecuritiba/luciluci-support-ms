import IdempotencyService from '../../../src/shared/services/idempotency.service';
import TestDataSource from '../../../src/shared/infrastructure/database/data-source-test';
import {
	clearDatabase,
	destroyTestDataSource,
	initializeTestDataSource,
} from '../../helpers/test-helpers';
import ConflictError from '../../../src/shared/kernel/exceptions/conflict.error';

describe('IdempotencyService', () => {
	const service = new IdempotencyService(TestDataSource);

	beforeAll(async () => {
		await initializeTestDataSource();
	});

	beforeEach(async () => {
		await clearDatabase();
	});

	afterAll(async () => {
		await destroyTestDataSource();
	});

	it('replays the same request after completion', async () => {
		const start = await service.startRequest(
			'key-1',
			'POST',
			'/synthetic-write',
			{ input: 'first' },
			'4fd7d24c-1c31-4430-bf62-0d658f20c36d',
		);

		await service.completeRequest(start.context, 201, {
			resultId: '56d34170-4813-47c0-85ac-a9fd35bbf2d9',
		});

		const replay = await service.startRequest(
			'key-1',
			'POST',
			'/synthetic-write',
			{ input: 'first' },
			'4fd7d24c-1c31-4430-bf62-0d658f20c36d',
		);

		expect(replay.replay?.statusCode).toBe(201);
		expect(replay.replay?.body).toEqual({
			resultId: '56d34170-4813-47c0-85ac-a9fd35bbf2d9',
		});
	});

	it('throws conflict when the same key is reused with a different body', async () => {
		await service.startRequest(
			'key-2',
			'POST',
			'/synthetic-write',
			{ input: 'first' },
			'a72f376f-da28-4ca9-bf5d-8df85285f8cd',
		);

		await expect(
			service.startRequest(
				'key-2',
				'POST',
				'/synthetic-write',
				{ input: 'second' },
				'a72f376f-da28-4ca9-bf5d-8df85285f8cd',
			),
		).rejects.toBeInstanceOf(ConflictError);
	});
});
