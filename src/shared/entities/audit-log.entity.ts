export default class AuditLog {
	id!: string;
	action!: string;
	resourceType!: string;
	resourceId!: string;
	correlationId!: string;
	performedBy?: string | null;
	performedByType?: string | null;
	metadata?: Record<string, unknown> | null;
	createdAt!: Date;
}
