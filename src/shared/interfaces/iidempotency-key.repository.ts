import IdempotencyKey from '../entities/idempotency-key.entity';

export default interface IIdempotencyKeyRepository {
	findByKey(key: string): Promise<IdempotencyKey | null>;
	save(record: IdempotencyKey): Promise<IdempotencyKey>;
	update(record: IdempotencyKey): Promise<IdempotencyKey>;
	deleteById(id: string): Promise<void>;
}
