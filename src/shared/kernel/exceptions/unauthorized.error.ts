import AppError from './app.error';
import { ErrorDetail } from './app.error';

export default class UnauthorizedError extends AppError {
	constructor(message = 'unauthorized', errors?: ErrorDetail[]) {
		super(401, message, errors);
	}
}
