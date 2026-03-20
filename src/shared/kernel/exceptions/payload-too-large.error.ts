import AppError from './app.error';
import { ErrorDetail } from './app.error';

export default class PayloadTooLargeError extends AppError {
	constructor(message = 'payload_too_large', errors?: ErrorDetail[]) {
		super(413, message, errors);
	}
}
