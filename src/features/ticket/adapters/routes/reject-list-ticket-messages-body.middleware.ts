import { NextFunction, Request, Response } from 'express';

import UnprocessableEntityError from '../../../../shared/kernel/exceptions/unprocessable-entity.error';

export default function rejectListTicketMessagesBodyMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction,
): void {
	if (
		req.method === 'GET' &&
		/^\/api\/support\/tickets\/[^/]+\/messages$/.test(req.path) &&
		(Number(req.header('content-length') ?? 0) > 0 || req.header('transfer-encoding'))
	) {
		next(
			new UnprocessableEntityError('validation_error', [
				{ field: 'body', code: 'forbidden', message: 'Request body is not allowed.' },
			]),
		);
		return;
	}
	next();
}
