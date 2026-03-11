import { NextFunction, Request, Response } from 'express';

import BadRequestError from '../exceptions/bad-request.error';
import IdempotencyService from '../../services/idempotency.service';

export default function createIdempotencyMiddleware(service: IdempotencyService) {
	return async function idempotencyMiddleware(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const key = req.header('Idempotency-Key');

		if (!key) {
			next(
				new BadRequestError(
					'IDEMPOTENCY_KEY_REQUIRED',
					'Idempotency-Key header is required for write operations.',
				),
			);
			return;
		}

		try {
			const result = await service.startRequest(
				key,
				req.method,
				req.originalUrl,
				req.body,
				req.correlationId,
			);

			if (result.replay) {
				res.setHeader('Idempotency-Replayed', 'true');
				res.status(result.replay.statusCode).json(result.replay.body);
				return;
			}

			res.locals.idempotencyContext = result.context;
			next();
		} catch (error) {
			next(error);
		}
	};
}
