import assert from 'node:assert/strict';
import type { QueryRunner } from 'typeorm';

import { W1Fixture, W1Row, W1_TABLES, W1Table } from './support-w1.fixture';
import { W1SeedError } from './support-w1.safety';

export interface W1Snapshot {
	rows: W1Fixture;
	sequence: { lastValue: number; isCalled: boolean };
}
export type W1State = 'EMPTY' | 'EXACT_W1' | 'DIVERGENT';

const normalize = (value: unknown): string | number | boolean | null => {
	if (value instanceof Date) return value.toISOString();
	if (
		value === null ||
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	)
		return value;
	throw new Error('Unexpected W1 database value');
};
const canonical = (rows: W1Row[]): string[] =>
	rows
		.map((row) =>
			JSON.stringify(
				Object.fromEntries(
					Object.entries(row)
						.map(([key, value]): [string, string | number | boolean | null] => [
							key,
							normalize(value),
						])
						.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
				),
			),
		)
		.sort();

export function classifyW1Snapshot(snapshot: W1Snapshot, fixture: W1Fixture): W1State {
	const empty = W1_TABLES.every((table) => snapshot.rows[table].length === 0);
	if (empty && snapshot.sequence.lastValue === 1 && !snapshot.sequence.isCalled) return 'EMPTY';
	const exact =
		snapshot.sequence.lastValue === 16 &&
		snapshot.sequence.isCalled &&
		W1_TABLES.every((table) => {
			const actual = canonical(snapshot.rows[table]);
			const expected = canonical(fixture[table]);
			return (
				actual.length === expected.length &&
				actual.every((row, index) => row === expected[index])
			);
		});
	return exact ? 'EXACT_W1' : 'DIVERGENT';
}

export async function applyW1State(
	state: W1State,
	write: () => Promise<void>,
): Promise<'CREATED' | 'ALREADY_SEEDED'> {
	if (state === 'DIVERGENT') {
		throw new W1SeedError(
			'SEED_W1_DIVERGENT',
			'W1 target differs from the canonical fixture or sequence; recreate the disposable database',
		);
	}
	if (state === 'EXACT_W1') return 'ALREADY_SEEDED';
	await write();
	return 'CREATED';
}

export async function assertW1SchemaReady(
	runner: QueryRunner,
	expectedDatabase: string,
): Promise<void> {
	const [database]: { database: string }[] = await runner.query(
		'SELECT current_database() AS database',
	);
	if (database?.database !== expectedDatabase) {
		throw new W1SeedError(
			'SEED_W1_REFUSED',
			'Connected database differs from explicit DB_NAME',
		);
	}
	const schema = await runner.query(
		"SELECT to_regclass('public.departments') AS departments, to_regclass('public.department_allowed_users') AS department_allowed_users, to_regclass('public.tickets') AS tickets, to_regclass('public.ticket_messages') AS ticket_messages, to_regclass('public.ticket_message_media') AS ticket_message_media, to_regclass('public.ticket_audit_logs') AS ticket_audit_logs, to_regclass('public.tickets_number_seq') AS tickets_number_seq",
	);
	if (!schema[0] || [...W1_TABLES, 'tickets_number_seq'].some((name) => !schema[0][name])) {
		throw new W1SeedError(
			'W1_SCHEMA_NOT_READY',
			'Support domain migrations are required before W1 seed',
		);
	}
}

export async function readW1Snapshot(
	runner: QueryRunner,
	expectedDatabase: string,
): Promise<W1Snapshot> {
	await assertW1SchemaReady(runner, expectedDatabase);
	const rows = {} as W1Fixture;
	for (const table of W1_TABLES) {
		const raw: Record<string, unknown>[] = await runner.query(
			'SELECT * FROM public."' + table + '"',
		);
		rows[table] = raw.map((row) =>
			Object.fromEntries(
				Object.entries(row).map(([name, value]) => [name, normalize(value)]),
			),
		);
	}
	const [sequence]: { last_value: string | number; is_called: boolean }[] = await runner.query(
		'SELECT last_value, is_called FROM public.tickets_number_seq',
	);
	return {
		rows,
		sequence: { lastValue: Number(sequence.last_value), isCalled: sequence.is_called },
	};
}

async function insertRows(
	runner: QueryRunner,
	table: W1Table,
	rows: W1Row[],
	omitNumber = false,
): Promise<void> {
	if (rows.length === 0) return;
	const columns = Object.keys(rows[0]).filter((name) => !(omitNumber && name === 'number'));
	const values: (string | number | boolean | null)[] = [];
	const groups = rows.map(
		(row) =>
			'(' +
			columns
				.map((column) => {
					values.push(row[column]);
					return '$' + values.length;
				})
				.join(',') +
			')',
	);
	const sql =
		'INSERT INTO public."' +
		table +
		'" (' +
		columns.map((name) => '"' + name + '"').join(',') +
		') VALUES ' +
		groups.join(',');
	await runner.query(sql, values);
}

export async function writeW1Fixture(runner: QueryRunner, fixture: W1Fixture): Promise<void> {
	await insertRows(runner, 'departments', fixture.departments);
	await insertRows(runner, 'department_allowed_users', fixture.department_allowed_users);
	for (const ticket of fixture.tickets) {
		const columns = Object.keys(ticket).filter((name) => name !== 'number');
		const inserted: { number: number }[] = await runner.query(
			'INSERT INTO public.tickets (' +
				columns.map((name) => '"' + name + '"').join(',') +
				') VALUES (' +
				columns.map((_, index) => '$' + (index + 1)).join(',') +
				') RETURNING number',
			columns.map((name) => ticket[name]),
		);
		assert.equal(
			inserted[0].number,
			ticket.number,
			'W1 Ticket.number sequence mismatch; recreate disposable DB',
		);
	}
	await insertRows(runner, 'ticket_messages', fixture.ticket_messages);
	await insertRows(runner, 'ticket_message_media', fixture.ticket_message_media);
	await insertRows(runner, 'ticket_audit_logs', fixture.ticket_audit_logs);
}
