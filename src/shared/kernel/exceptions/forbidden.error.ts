import AppError from './app.error';
import { ErrorDetail } from './app.error';

export default class ForbiddenError extends AppError {
	constructor(message = 'forbidden', errors?: ErrorDetail[]) {
		super(403, message, errors);
	}
}
