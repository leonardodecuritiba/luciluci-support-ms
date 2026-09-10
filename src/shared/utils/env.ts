import dotenv from 'dotenv';

dotenv.config({ quiet: true });

function readEnv(name: string, fallback?: string): string {
	const value = process.env[name] ?? fallback;

	if (value === undefined) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

export const env = {
	nodeEnv: readEnv('NODE_ENV', 'development'),
	serverPort: Number(readEnv('SERVER_PORT', '3000')),
	db: {
		host: readEnv('DB_HOST', 'localhost'),
		port: Number(readEnv('DB_PORT', '5432')),
		username: readEnv('DB_USER', 'postgres'),
		password: readEnv('DB_PASSWORD', 'postgres'),
		database: readEnv('DB_NAME', 'support_ms'),
	},
};

export function isTestEnvironment(): boolean {
	return env.nodeEnv === 'test';
}
