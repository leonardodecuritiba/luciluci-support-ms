import { randomUUID } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

export default function correlationIdMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const correlationId = req.header('X-Correlation-ID') || randomUUID();
	req.correlationId = correlationId;
	res.setHeader('X-Correlation-ID', correlationId);
	next();
}
