import AppError from './app.error';
import { ErrorDetail } from './app.error';

export default class UnsupportedMediaTypeError extends AppError {
	constructor(message = 'unsupported_media', errors?: ErrorDetail[]) {
		super(415, message, errors);
	}
}
