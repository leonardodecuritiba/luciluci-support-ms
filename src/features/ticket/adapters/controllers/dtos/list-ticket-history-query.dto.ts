import UnprocessableEntityError from '../../../../../shared/kernel/exceptions/unprocessable-entity.error';
import { ListTicketHistoryFilters } from '../../../use-cases/repositories/ilist-ticket-history.repository';

const ALLOWED_KEYS = new Set(['ticketId', 'page', 'size']);
const POSITIVE_INTEGER = /^[1-9]\d*$/;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function invalid(field: string, code: string): never {
	throw new UnprocessableEntityError('validation_error', [
		{ field, code, message: `Invalid ${field} query parameter.` },
	]);
}

function positiveInteger(field: string, value: string | undefined, fallback: number): number {
	if (value === undefined) return fallback;
	if (!POSITIVE_INTEGER.test(value)) invalid(field, 'isInt');
	const parsed = Number(value);
	if (!Number.isSafeInteger(parsed)) invalid(field, 'isInt');
	return parsed;
}

export function parseListTicketHistoryQuery(originalUrl: string): ListTicketHistoryFilters {
	const params = new URL(originalUrl, 'http://support.local').searchParams;
	const values = new Map<string, string>();
	for (const [key, value] of params) {
		if (!ALLOWED_KEYS.has(key)) invalid(key, 'unknown');
		if (values.has(key)) invalid(key, 'repeated');
		values.set(key, value);
	}
	const ticketId = values.get('ticketId');
	if (ticketId !== undefined && !UUID_V4.test(ticketId)) invalid('ticketId', 'isUuid');
	const page = positiveInteger('page', values.get('page'), 1);
	const size = positiveInteger('size', values.get('size'), 20);
	if (size > 100) invalid('size', 'max');
	return { ticketId, page, size };
}
