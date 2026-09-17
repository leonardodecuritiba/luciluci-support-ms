import { randomUUID } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

import BadRequestError from '../exceptions/bad-request.error';

const EXEMPT_PATH_PREFIXES = ['/api-docs', '/api-docs-json', '/metrics', '/health'];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function correlationIdMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	if (req.method === 'OPTIONS' || isExemptPath(req.path)) {
		const correlationId = req.header('X-Correlation-ID') || randomUUID();
		req.correlationId = correlationId;
		res.setHeader('X-Correlation-ID', correlationId);
		next();
		return;
	}

	const correlationId = req.header('X-Correlation-ID');
	if (!correlationId) {
		next(
			new BadRequestError('bad_request', [
				{
					field: 'X-Correlation-ID',
					code: 'required',
					message: 'X-Correlation-ID header is required.',
				},
			]),
		);
		return;
	}
	if (!UUID_PATTERN.test(correlationId)) {
		next(
			new BadRequestError('bad_request', [
				{
					field: 'X-Correlation-ID',
					code: 'isUuid',
					message: 'X-Correlation-ID must be a UUID.',
				},
			]),
		);
		return;
	}

	req.correlationId = correlationId;
	res.setHeader('X-Correlation-ID', correlationId);
	next();
}

function isExemptPath(pathname: string): boolean {
	return EXEMPT_PATH_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
	);
}
