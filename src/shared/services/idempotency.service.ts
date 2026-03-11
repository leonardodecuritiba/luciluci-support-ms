import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';

import IdempotencyKey from '../entities/idempotency-key.entity';
import IdempotencyState from '../entities/enums/idempotency-state.enum';
import ConflictError from '../kernel/exceptions/conflict.error';
import { stableStringify } from '../utils/stable-json';
import IdempotencyKeyTypeormRepository from '../adapters/repositories/idempotency-key-typeorm.repository';

export interface IdempotencyContext {
	recordId: string;
	key: string;
	fingerprint: string;
	completed: boolean;
}

export interface ReplayResponse {
	statusCode: number;
	body: object;
}

export default class IdempotencyService {
	constructor(private readonly dataSource: DataSource) {}

	static buildFingerprint(method: string, route: string, body: unknown): string {
		return stableStringify({
			method,
			route,
			body,
		});
	}

	async startRequest(
		key: string,
		method: string,
		route: string,
		body: unknown,
		correlationId: string,
	): Promise<{ replay?: ReplayResponse; context?: IdempotencyContext }> {
		const repository = new IdempotencyKeyTypeormRepository(this.dataSource.manager);
		const existing = await repository.findByKey(key);
		const fingerprint = IdempotencyService.buildFingerprint(method, route, body);

		if (existing) {
			if (existing.fingerprint !== fingerprint) {
				throw new ConflictError(
					'IDEMPOTENCY_KEY_REUSED',
					'Idempotency-Key was already used with a different request payload.',
				);
			}

			if (existing.state === IdempotencyState.Completed && existing.responseBody) {
				return {
					replay: {
						statusCode: existing.responseStatus ?? 200,
						body: existing.responseBody,
					},
				};
			}

			throw new ConflictError(
				'IDEMPOTENT_REQUEST_IN_PROGRESS',
				'An idempotent request with this key is already being processed.',
			);
		}

		const record = new IdempotencyKey();
		record.id = randomUUID();
		record.key = key;
		record.fingerprint = fingerprint;
		record.method = method;
		record.route = route;
		record.correlationId = correlationId;
		record.state = IdempotencyState.Pending;

		await repository.save(record);

		return {
			context: {
				recordId: record.id,
				key: record.key,
				fingerprint,
				completed: false,
			},
		};
	}

	async completeRequest(
		context: IdempotencyContext | undefined,
		statusCode: number,
		body: object,
	): Promise<void> {
		if (!context) {
			return;
		}

		const repository = new IdempotencyKeyTypeormRepository(this.dataSource.manager);
		const record = await repository.findByKey(context.key);

		if (!record) {
			return;
		}

		record.state = IdempotencyState.Completed;
		record.responseStatus = statusCode;
		record.responseBody = body as Record<string, unknown>;
		context.completed = true;
		await repository.update(record);
	}

	async releaseRequest(context: IdempotencyContext | undefined): Promise<void> {
		if (!context || context.completed) {
			return;
		}

		const repository = new IdempotencyKeyTypeormRepository(this.dataSource.manager);
		await repository.deleteById(context.recordId);
	}
}
