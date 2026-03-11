import { NextFunction, Request, Response } from 'express';

export default function performedByMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  req.performedBy = req.header('X-Performed-By') || undefined;
  req.performedByType = req.header('X-Performed-By-Type') || undefined;
  next();
}

