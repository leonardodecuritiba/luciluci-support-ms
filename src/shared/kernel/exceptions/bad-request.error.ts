import AppError from './app.error';
import { ErrorDetail } from './app.error';

export default class BadRequestError extends AppError {
	constructor(message = 'bad_request', errors?: ErrorDetail[]) {
		super(400, message, errors);
	}
}
