import { NextFunction, Request, Response } from 'express';

import BadRequestError from '../exceptions/bad-request.error';
import IdempotencyService from '../../services/idempotency.service';

type FingerprintBuilder = (req: Request) => unknown | Promise<unknown>;

export default function createIdempotencyMiddleware(
	service: IdempotencyService,
	fingerprintBuilder?: FingerprintBuilder,
) {
	return async function idempotencyMiddleware(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const key = req.header('X-Idempotency-Key');

		if (!key) {
			next(
				new BadRequestError('bad_request', [
					{
						field: 'X-Idempotency-Key',
						code: 'required',
						message: 'X-Idempotency-Key header is required for write operations.',
					},
				]),
			);
			return;
		}

		try {
			const fingerprintPayload = fingerprintBuilder
				? await fingerprintBuilder(req)
				: req.body;
			const result = await service.startRequest(
				key,
				req.method,
				req.originalUrl,
				fingerprintPayload,
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
