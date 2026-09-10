import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSupportBootstrapInfrastructure1767990000000 implements MigrationInterface {
	name = 'CreateSupportBootstrapInfrastructure1767990000000';

	async up(queryRunner: QueryRunner): Promise<void> {
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
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('idempotency_keys');
	}
}
