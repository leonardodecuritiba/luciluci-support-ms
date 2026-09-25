import UnprocessableEntityError from '../../../../../shared/kernel/exceptions/unprocessable-entity.error';
import { ListTicketMessagesFilters } from '../../../use-cases/repositories/ilist-ticket-messages.repository';

const ALLOWED_KEYS = new Set(['page', 'size', 'isVisibleToRequester']);
const POSITIVE_INTEGER = /^[1-9]\d*$/;

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

export function parseListTicketMessagesQuery(originalUrl: string): ListTicketMessagesFilters {
	const params = new URL(originalUrl, 'http://support.local').searchParams;
	const values = new Map<string, string>();
	for (const [key, value] of params) {
		if (!ALLOWED_KEYS.has(key)) invalid(key, 'unknown');
		if (values.has(key)) invalid(key, 'repeated');
		values.set(key, value);
	}
	const page = positiveInteger('page', values.get('page'), 1);
	const size = positiveInteger('size', values.get('size'), 20);
	if (size > 100) invalid('size', 'max');
	const rawVisibility = values.get('isVisibleToRequester');
	if (rawVisibility !== undefined && rawVisibility !== 'true' && rawVisibility !== 'false') {
		invalid('isVisibleToRequester', 'isBoolean');
	}
	return {
		page,
		size,
		isVisibleToRequester: rawVisibility === undefined ? undefined : rawVisibility === 'true',
	};
}
