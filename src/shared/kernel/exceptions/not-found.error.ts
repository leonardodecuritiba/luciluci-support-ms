import AppError from './app.error';

export default class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

