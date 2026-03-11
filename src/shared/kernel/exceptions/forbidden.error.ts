import AppError from './app.error';

export default class ForbiddenError extends AppError {
	constructor(code = 'FORBIDDEN', message = 'Forbidden') {
		super(403, code, message);
	}
}
