export interface ErrorDetails {
	[key: string]: unknown;
}

export default class AppError extends Error {
	constructor(
		public readonly statusCode: number,
		public readonly code: string,
		message: string,
		public readonly details?: ErrorDetails,
	) {
		super(message);
		this.name = new.target.name;
	}
}
