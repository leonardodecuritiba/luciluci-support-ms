import type { NextFunction, Request, Response } from 'express';

import createErrorHandler from '../../../src/shared/kernel/middlewares/error-handler';
import BadRequestError from '../../../src/shared/kernel/exceptions/bad-request.error';
import TestDataSource from '../../../src/shared/infrastructure/database/data-source-test';
import { destroyTestDataSource, initializeTestDataSource } from '../../helpers/test-helpers';

describe('errorHandler', () => {
	beforeAll(async () => {
		await initializeTestDataSource();
	});

	afterAll(async () => {
		await destroyTestDataSource();
	});

	it('returns standardized error payload', async () => {
		const handler = createErrorHandler(TestDataSource);
		const req = {
			correlationId: '8021b0b0-5855-4c1c-8086-85bba8f4ec94',
		} as Request;
		const json = jest.fn();
		const status = jest.fn(() => ({ json }));
		const res = {
			locals: {},
			status,
		} as unknown as Response;

		await handler(
			new BadRequestError('INVALID_INPUT', 'Invalid input data.'),
			req,
			res,
			jest.fn() as NextFunction,
		);

		expect(status).toHaveBeenCalledWith(400);
		expect(json).toHaveBeenCalledWith(
			expect.objectContaining({
				code: 'INVALID_INPUT',
				correlationId: req.correlationId,
			}),
		);
	});
});
