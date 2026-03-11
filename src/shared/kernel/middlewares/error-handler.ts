import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';

import logger from '../../infrastructure/logger';
import AppError from '../exceptions/app.error';
import IdempotencyService from '../../services/idempotency.service';

export default function createErrorHandler(dataSource: DataSource) {
	const idempotencyService = new IdempotencyService(dataSource);

	return async function errorHandler(
		error: Error,
		req: Request,
		res: Response,
		_next: NextFunction,
	): Promise<void> {
		await idempotencyService.releaseRequest(res.locals.idempotencyContext);

		if (error instanceof AppError) {
			logger.warn(
				{
					code: error.code,
					statusCode: error.statusCode,
					correlationId: req.correlationId,
					details: error.details,
				},
				error.message,
			);

			res.status(error.statusCode).json({
				code: error.code,
				message: error.message,
				statusCode: error.statusCode,
				correlationId: req.correlationId,
				details: error.details,
			});
			return;
		}

		logger.error({ err: error, correlationId: req.correlationId }, 'Unhandled error');
		res.status(500).json({
			code: 'INTERNAL_SERVER_ERROR',
			message: 'Internal server error.',
			statusCode: 500,
			correlationId: req.correlationId,
		});
	};
}
