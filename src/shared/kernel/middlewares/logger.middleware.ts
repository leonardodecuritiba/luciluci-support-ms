import { NextFunction, Request, Response } from 'express';

import logger from '../../infrastructure/logger';

export default function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startedAt = Date.now();

  res.on('finish', () => {
    logger.info({
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      correlationId: req.correlationId,
    });
  });

  next();
}

