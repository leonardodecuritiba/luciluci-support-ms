import AppError from './app.error';
import { ErrorDetail } from './app.error';

export default class UnprocessableEntityError extends AppError {
	constructor(message = 'validation_error', errors?: ErrorDetail[]) {
		super(422, message, errors);
	}
}
