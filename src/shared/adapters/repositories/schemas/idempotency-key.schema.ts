import { EntitySchema } from 'typeorm';

import IdempotencyKey from '../../../entities/idempotency-key.entity';

const IdempotencyKeySchema = new EntitySchema<IdempotencyKey>({
  name: 'IdempotencyKey',
  target: IdempotencyKey,
  tableName: 'idempotency_keys',
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid',
    },
    key: {
      type: String,
      unique: true,
    },
    fingerprint: {
      type: String,
    },
    method: {
      type: String,
    },
    route: {
      type: String,
    },
    correlationId: {
      name: 'correlation_id',
      type: String,
    },
    state: {
      type: String,
    },
    responseStatus: {
      name: 'response_status',
      type: Number,
      nullable: true,
    },
    responseBody: {
      name: 'response_body',
      type: 'simple-json',
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: Date,
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: Date,
      updateDate: true,
    },
  },
});

export default IdempotencyKeySchema;

