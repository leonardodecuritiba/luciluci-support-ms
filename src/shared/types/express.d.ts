import { IdempotencyContext } from '../services/idempotency.service';

declare global {
  namespace Express {
    interface Request {
      correlationId: string;
      performedBy?: string;
      performedByType?: string;
    }

    interface Locals {
      idempotencyContext?: IdempotencyContext;
    }
  }
}

export {};

