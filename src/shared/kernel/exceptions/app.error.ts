export interface ErrorDetail {
	field?: string;
	code: string;
	message?: string;
}

export default class AppError extends Error {
	constructor(
		public readonly statusCode: number,
		message: string,
		public readonly errors?: ErrorDetail[],
	) {
		super(message);
		this.name = new.target.name;
	}
}
