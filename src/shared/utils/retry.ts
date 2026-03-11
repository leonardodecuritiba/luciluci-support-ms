export async function retry<T>(
	action: () => Promise<T>,
	attempts: number,
	delayMs: number,
): Promise<T> {
	let lastError: unknown;

	for (let attempt = 1; attempt <= attempts; attempt += 1) {
		try {
			return await action();
		} catch (error) {
			lastError = error;

			if (attempt < attempts) {
				await new Promise((resolve) => {
					setTimeout(resolve, delayMs);
				});
			}
		}
	}

	throw lastError;
}
