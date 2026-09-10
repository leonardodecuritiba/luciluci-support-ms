import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateSupportDepartments1768000000000 implements MigrationInterface {
	name = 'CreateSupportDepartments1768000000000';

	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'departments',
				columns: [
					{ name: 'id', type: 'uuid', isPrimary: true },
					{ name: 'name', type: 'varchar' },
					{ name: 'type', type: 'varchar' },
					{ name: 'active', type: 'boolean', default: 'true' },
					{ name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
					{ name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
				],
			}),
		);
		await queryRunner.createTable(
			new Table({
				name: 'department_allowed_users',
				columns: [
					{ name: 'department_id', type: 'uuid', isPrimary: true },
					{ name: 'position', type: 'integer', isPrimary: true },
					{ name: 'user_id', type: 'varchar' },
				],
				foreignKeys: [
					{
						columnNames: ['department_id'],
						referencedTableName: 'departments',
						referencedColumnNames: ['id'],
						onDelete: 'CASCADE',
					},
				],
			}),
		);
		await queryRunner.createIndex(
			'department_allowed_users',
			new TableIndex({
				name: 'IDX_department_allowed_users_user_id_department_id',
				columnNames: ['user_id', 'department_id'],
			}),
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('department_allowed_users');
		await queryRunner.dropTable('departments');
	}
}
