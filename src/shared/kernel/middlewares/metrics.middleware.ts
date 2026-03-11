import { NextFunction, Request, Response } from 'express';

import { httpRequestCounter, httpRequestDuration } from '../../infrastructure/metrics/registry';

export default function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const route = req.route?.path || req.path;
    const labels = {
      method: req.method,
      route: `${req.baseUrl || ''}${route}`,
      status_code: String(res.statusCode),
    };

    httpRequestCounter.inc(labels);
    httpRequestDuration.observe(labels, durationMs);
  });

  next();
}

