import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateStandardMsBaseTables1767990000000 implements MigrationInterface {
	name = 'CreateStandardMsBaseTables1767990000000';

	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'profiles',
				columns: [
					{ name: 'id', type: 'uuid', isPrimary: true },
					{ name: 'external_id', type: 'varchar', isUnique: true },
					{ name: 'display_name', type: 'varchar' },
					{ name: 'email', type: 'varchar' },
					{ name: 'phone', type: 'varchar', isNullable: true },
					{ name: 'entity_type', type: 'varchar' },
					{ name: 'status', type: 'varchar' },
					{ name: 'country', type: 'varchar', isNullable: true },
					{ name: 'city', type: 'varchar', isNullable: true },
					{ name: 'classification_id_snapshot', type: 'varchar', isNullable: true },
					{ name: 'classification_name_snapshot', type: 'varchar', isNullable: true },
					{ name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
					{ name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
				],
			}),
		);

		await queryRunner.createIndex(
			'profiles',
			new TableIndex({
				name: 'idx_profiles_status',
				columnNames: ['status'],
			}),
		);

		await queryRunner.createTable(
			new Table({
				name: 'outbox_events',
				columns: [
					{ name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid' },
					{ name: 'aggregate_type', type: 'varchar' },
					{ name: 'aggregate_id', type: 'varchar' },
					{ name: 'topic', type: 'varchar' },
					{ name: 'event_type', type: 'varchar' },
					{ name: 'exchange', type: 'varchar' },
					{ name: 'routing_key', type: 'varchar' },
					{ name: 'payload', type: 'jsonb' },
					{ name: 'headers', type: 'jsonb', isNullable: true },
					{ name: 'attempts', type: 'integer', default: 0 },
					{ name: 'last_error', type: 'text', isNullable: true },
					{ name: 'occurred_at', type: 'timestamp' },
					{ name: 'processed_at', type: 'timestamp', isNullable: true },
					{ name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
					{ name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
				],
			}),
		);

		await queryRunner.createTable(
			new Table({
				name: 'idempotency_keys',
				columns: [
					{ name: 'id', type: 'uuid', isPrimary: true },
					{ name: 'key', type: 'varchar', isUnique: true },
					{ name: 'fingerprint', type: 'text' },
					{ name: 'method', type: 'varchar' },
					{ name: 'route', type: 'varchar' },
					{ name: 'correlation_id', type: 'varchar' },
					{ name: 'state', type: 'varchar' },
					{ name: 'response_status', type: 'integer', isNullable: true },
					{ name: 'response_body', type: 'jsonb', isNullable: true },
					{ name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
					{ name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
				],
			}),
		);

		await queryRunner.createTable(
			new Table({
				name: 'processed_messages',
				columns: [
					{ name: 'id', type: 'uuid', isPrimary: true },
					{ name: 'consumer_name', type: 'varchar' },
					{ name: 'message_id', type: 'varchar' },
					{ name: 'correlation_id', type: 'varchar', isNullable: true },
					{ name: 'processed_at', type: 'timestamp' },
					{ name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
				],
			}),
		);

		await queryRunner.createIndex(
			'processed_messages',
			new TableIndex({
				name: 'idx_processed_messages_consumer_message',
				columnNames: ['consumer_name', 'message_id'],
				isUnique: true,
			}),
		);

		await queryRunner.createTable(
			new Table({
				name: 'audit_logs',
				columns: [
					{ name: 'id', type: 'uuid', isPrimary: true },
					{ name: 'action', type: 'varchar' },
					{ name: 'resource_type', type: 'varchar' },
					{ name: 'resource_id', type: 'varchar' },
					{ name: 'correlation_id', type: 'varchar' },
					{ name: 'performed_by', type: 'varchar', isNullable: true },
					{ name: 'performed_by_type', type: 'varchar', isNullable: true },
					{ name: 'metadata', type: 'jsonb', isNullable: true },
					{ name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
				],
			}),
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('audit_logs');
		await queryRunner.dropTable('processed_messages');
		await queryRunner.dropTable('idempotency_keys');
		await queryRunner.dropTable('outbox_events');
		await queryRunner.dropTable('profiles');
	}
}
