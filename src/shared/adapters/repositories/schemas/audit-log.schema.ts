import { EntitySchema } from 'typeorm';

import AuditLog from '../../../entities/audit-log.entity';

const AuditLogSchema = new EntitySchema<AuditLog>({
  name: 'AuditLog',
  target: AuditLog,
  tableName: 'audit_logs',
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid',
    },
    action: {
      type: String,
    },
    resourceType: {
      name: 'resource_type',
      type: String,
    },
    resourceId: {
      name: 'resource_id',
      type: String,
    },
    correlationId: {
      name: 'correlation_id',
      type: String,
    },
    performedBy: {
      name: 'performed_by',
      type: String,
      nullable: true,
    },
    performedByType: {
      name: 'performed_by_type',
      type: String,
      nullable: true,
    },
    metadata: {
      type: 'simple-json',
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: Date,
      createDate: true,
    },
  },
});

export default AuditLogSchema;

