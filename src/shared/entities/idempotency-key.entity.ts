import IdempotencyState from './enums/idempotency-state.enum';

export default class IdempotencyKey {
	id!: string;
	key!: string;
	fingerprint!: string;
	method!: string;
	route!: string;
	correlationId!: string;
	state: IdempotencyState = IdempotencyState.Pending;
	responseStatus?: number | null;
	responseBody?: Record<string, unknown> | null;
	createdAt!: Date;
	updatedAt!: Date;
}
