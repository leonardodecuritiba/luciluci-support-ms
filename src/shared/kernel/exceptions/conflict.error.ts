import AppError from './app.error';
import { ErrorDetail } from './app.error';

export default class ConflictError extends AppError {
	constructor(message = 'conflict', errors?: ErrorDetail[]) {
		super(409, message, errors);
	}
}
