import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import UnprocessableEntityError from '../exceptions/unprocessable-entity.error';
import { ErrorDetail } from '../exceptions/app.error';

function mapValidationErrors(errors: ValidationError[], parentPath?: string): ErrorDetail[] {
	return errors.flatMap((error) => {
		const path = parentPath ? `${parentPath}.${error.property}` : error.property;
		const ownErrors =
			error.constraints === undefined
				? []
				: Object.entries(error.constraints).map(([code, message]) => ({
						field: path,
						code,
						message,
					}));

		const children = error.children?.length ? mapValidationErrors(error.children, path) : [];

		return [...ownErrors, ...children];
	});
}

export async function validateDto<T extends object>(
	dtoClass: new () => T,
	payload: unknown,
): Promise<T> {
	const dto = plainToInstance(dtoClass, payload);
	const errors = await validate(dto as object, {
		whitelist: true,
		forbidNonWhitelisted: true,
	});

	if (errors.length > 0) {
		throw new UnprocessableEntityError('validation_error', mapValidationErrors(errors));
	}

	return dto;
}
