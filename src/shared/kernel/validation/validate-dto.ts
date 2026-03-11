import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import BadRequestError from '../exceptions/bad-request.error';

function mapValidationErrors(errors: ValidationError[]): Record<string, string[]> {
  return errors.reduce<Record<string, string[]>>((acc, error) => {
    if (error.constraints) {
      acc[error.property] = Object.values(error.constraints);
    }

    return acc;
  }, {});
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
    throw new BadRequestError(
      'INVALID_INPUT',
      'Invalid input data.',
      mapValidationErrors(errors),
    );
  }

  return dto;
}

