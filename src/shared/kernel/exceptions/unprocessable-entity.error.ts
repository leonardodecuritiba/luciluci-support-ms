import AppError from './app.error';

export default class UnprocessableEntityError extends AppError {
	constructor(code: string, message: string, details?: Record<string, unknown>) {
		super(422, code, message, details);
	}
}
