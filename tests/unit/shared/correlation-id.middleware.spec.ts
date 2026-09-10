import { NextFunction, Request, Response } from 'express';

import correlationIdMiddleware from '../../../src/shared/kernel/middlewares/correlation-id.middleware';

describe('correlation-id.middleware', () => {
	it('rejects business requests without X-Correlation-ID', () => {
		const req = {
			method: 'GET',
			path: '/synthetic-business-route',
			header: jest.fn().mockReturnValue(undefined),
		} as unknown as Request;
		const res = {
			setHeader: jest.fn(),
		} as unknown as Response;
		const next = jest.fn() as NextFunction;

		correlationIdMiddleware(req, res, next);

		expect(next).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 400,
				message: 'bad_request',
				errors: [
					{
						field: 'X-Correlation-ID',
						code: 'required',
						message: 'X-Correlation-ID header is required.',
					},
				],
			}),
		);
		expect(res.setHeader).not.toHaveBeenCalled();
	});

	it('accepts business requests when X-Correlation-ID is provided', () => {
		const req = {
			method: 'GET',
			path: '/synthetic-business-route',
			header: jest.fn().mockReturnValue('8021b0b0-5855-4c1c-8086-85bba8f4ec94'),
		} as unknown as Request;
		const res = {
			setHeader: jest.fn(),
		} as unknown as Response;
		const next = jest.fn() as NextFunction;

		correlationIdMiddleware(req, res, next);

		expect(req.correlationId).toBe('8021b0b0-5855-4c1c-8086-85bba8f4ec94');
		expect(res.setHeader).toHaveBeenCalledWith(
			'X-Correlation-ID',
			'8021b0b0-5855-4c1c-8086-85bba8f4ec94',
		);
		expect(next).toHaveBeenCalledWith();
	});

	it('keeps operational endpoints accessible without the header', () => {
		const req = {
			method: 'GET',
			path: '/health',
			header: jest.fn().mockReturnValue(undefined),
		} as unknown as Request;
		const res = {
			setHeader: jest.fn(),
		} as unknown as Response;
		const next = jest.fn() as NextFunction;

		correlationIdMiddleware(req, res, next);

		expect(req.correlationId).toEqual(expect.any(String));
		expect(res.setHeader).toHaveBeenCalledWith('X-Correlation-ID', expect.any(String));
		expect(next).toHaveBeenCalledWith();
	});
});
