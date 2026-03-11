import AppError from './app.error';

export default class UnauthorizedError extends AppError {
	constructor(code = 'UNAUTHORIZED', message = 'Unauthorized') {
		super(401, code, message);
	}
}
