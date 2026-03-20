import AppError from './app.error';
import { ErrorDetail } from './app.error';

export default class NotFoundError extends AppError {
	constructor(message = 'not_found', errors?: ErrorDetail[]) {
		super(404, message, errors);
	}
}
