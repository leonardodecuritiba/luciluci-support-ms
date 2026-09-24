import { MigrationInterface, QueryRunner, Table, TableCheck } from 'typeorm';

export class CreateSupportTickets1768010000000 implements MigrationInterface {
	name = 'CreateSupportTickets1768010000000';

	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'CREATE SEQUENCE "tickets_number_seq" AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1',
		);
		await queryRunner.createTable(
			new Table({
				name: 'tickets',
				columns: [
					{ name: 'id', type: 'uuid', isPrimary: true },
					{
						name: 'number',
						type: 'integer',
						isNullable: false,
						isUnique: true,
						default: `nextval('tickets_number_seq'::regclass)`,
					},
					{ name: 'subject', type: 'varchar' },
					{ name: 'requester_id', type: 'varchar' },
					{ name: 'department_id', type: 'uuid' },
					{ name: 'priority', type: 'varchar' },
					{ name: 'origin', type: 'varchar' },
					{ name: 'admin_status', type: 'varchar' },
					{ name: 'requester_status', type: 'varchar' },
					{ name: 'created_at', type: 'timestamp' },
					{ name: 'updated_at', type: 'timestamp' },
				],
				foreignKeys: [
					{
						columnNames: ['department_id'],
						referencedTableName: 'departments',
						referencedColumnNames: ['id'],
						onDelete: 'RESTRICT',
					},
				],
				checks: [
					new TableCheck({
						name: 'CHK_tickets_number_positive',
						expression: '"number" > 0',
					}),
					new TableCheck({
						name: 'CHK_tickets_priority',
						expression: `"priority" IN ('baixa', 'media', 'alta', 'urgente')`,
					}),
					new TableCheck({
						name: 'CHK_tickets_origin',
						expression: `"origin" IN ('backoffice', 'cd')`,
					}),
					new TableCheck({
						name: 'CHK_tickets_admin_status',
						expression: `"admin_status" IN ('pendente', 'cancelado', 'em_andamento', 'finalizado', 'resolvido')`,
					}),
					new TableCheck({
						name: 'CHK_tickets_requester_status',
						expression: `"requester_status" IN ('nao_resolvido', 'resolvido')`,
					}),
				],
			}),
		);

		await queryRunner.createTable(
			new Table({
				name: 'ticket_messages',
				columns: [
					{ name: 'id', type: 'uuid', isPrimary: true },
					{ name: 'ticket_id', type: 'uuid' },
					{ name: 'message', type: 'varchar' },
					{ name: 'type', type: 'varchar' },
					{ name: 'author_id', type: 'varchar' },
					{ name: 'is_visible_to_requester', type: 'boolean' },
					{ name: 'created_at', type: 'timestamp' },
				],
				foreignKeys: [
					{
						columnNames: ['ticket_id'],
						referencedTableName: 'tickets',
						referencedColumnNames: ['id'],
						onDelete: 'CASCADE',
					},
				],
				checks: [
					new TableCheck({
						name: 'CHK_ticket_messages_type',
						expression: `"type" IN ('admin', 'backoffice', 'cd')`,
					}),
				],
			}),
		);

		await queryRunner.createTable(
			new Table({
				name: 'ticket_message_media',
				columns: [
					{ name: 'ticket_message_id', type: 'uuid', isPrimary: true },
					{ name: 'position', type: 'integer', isPrimary: true },
					{ name: 'media_id', type: 'varchar' },
				],
				foreignKeys: [
					{
						columnNames: ['ticket_message_id'],
						referencedTableName: 'ticket_messages',
						referencedColumnNames: ['id'],
						onDelete: 'CASCADE',
					},
				],
				checks: [
					new TableCheck({
						name: 'CHK_ticket_message_media_position',
						expression: '"position" >= 0',
					}),
				],
			}),
		);

		await queryRunner.createTable(
			new Table({
				name: 'ticket_audit_logs',
				columns: [
					{ name: 'id', type: 'uuid', isPrimary: true },
					{ name: 'ticket_id', type: 'uuid' },
					{ name: 'datetime', type: 'timestamp' },
					{ name: 'author_id', type: 'varchar' },
					{ name: 'origin', type: 'varchar' },
					{ name: 'action', type: 'varchar' },
					{ name: 'status_type', type: 'varchar', isNullable: true },
					{ name: 'new_status', type: 'varchar', isNullable: true },
				],
				foreignKeys: [
					{
						columnNames: ['ticket_id'],
						referencedTableName: 'tickets',
						referencedColumnNames: ['id'],
						onDelete: 'CASCADE',
					},
				],
				checks: [
					new TableCheck({
						name: 'CHK_ticket_audit_logs_origin',
						expression: `"origin" IN ('backoffice', 'admin', 'cd')`,
					}),
					new TableCheck({
						name: 'CHK_ticket_audit_logs_action',
						expression: `"action" IN ('criacao_ticket', 'nova_mensagem', 'alteracao_status')`,
					}),
					new TableCheck({
						name: 'CHK_ticket_audit_logs_status_fields',
						expression: `("action" = 'alteracao_status' AND "status_type" IN ('admin', 'requester') AND "new_status" IS NOT NULL) OR ("action" <> 'alteracao_status' AND "status_type" IS NULL AND "new_status" IS NULL)`,
					}),
				],
			}),
		);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('ticket_audit_logs');
		await queryRunner.dropTable('ticket_message_media');
		await queryRunner.dropTable('ticket_messages');
		await queryRunner.dropTable('tickets');
		await queryRunner.query('DROP SEQUENCE "tickets_number_seq"');
	}
}
