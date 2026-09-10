import AppDataSource from './shared/infrastructure/database/data-source';
import logger from './shared/infrastructure/logger';
import { env } from './shared/utils/env';
import { retry } from './shared/utils/retry';
import createApp from './app';

async function bootstrap(): Promise<void> {
	await retry(() => AppDataSource.initialize(), 10, 3000);

	const app = createApp(AppDataSource);

	app.listen(env.serverPort, () => {
		logger.info({ port: env.serverPort }, 'support-ms is running.');
	});
}

bootstrap().catch((error) => {
	logger.error({ err: error }, 'Failed to bootstrap support-ms.');
	process.exit(1);
});
