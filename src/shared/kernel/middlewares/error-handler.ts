import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';

import logger from '../../infrastructure/logger';
import BadRequestError from '../exceptions/bad-request.error';
import AppError from '../exceptions/app.error';
import IdempotencyService from '../../services/idempotency.service';

interface JsonParseError extends SyntaxError {
	status?: number;
	type?: string;
}

function normalizeHttpError(error: Error): Error {
	const candidate = error as JsonParseError;

	if (
		error instanceof SyntaxError &&
		candidate.status === 400 &&
		candidate.type === 'entity.parse.failed'
	) {
		return new BadRequestError('bad_request', [
			{
				field: 'body',
				code: 'invalid_json',
				message: 'Request body contains invalid JSON.',
			},
		]);
	}

	return error;
}

export default function createErrorHandler(dataSource: DataSource) {
	const idempotencyService = new IdempotencyService(dataSource);

	return async function errorHandler(
		error: Error,
		req: Request,
		res: Response,
		_next: NextFunction,
	): Promise<void> {
		await idempotencyService.releaseRequest(res.locals.idempotencyContext);

		const normalizedError = normalizeHttpError(error);

		if (normalizedError instanceof AppError) {
			logger.warn(
				{
					statusCode: normalizedError.statusCode,
					correlationId: req.correlationId,
					errors: normalizedError.errors,
				},
				normalizedError.message,
			);

			res.status(normalizedError.statusCode).json({
				status_code: normalizedError.statusCode,
				message: normalizedError.message,
				errors: normalizedError.errors,
			});
			return;
		}

		logger.error({ err: normalizedError, correlationId: req.correlationId }, 'Unhandled error');
		res.status(500).json({
			status_code: 500,
			message: 'internal_error',
		});
	};
}
