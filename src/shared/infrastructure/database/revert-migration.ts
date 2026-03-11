import AppDataSource from './data-source';
import logger from '../logger';

async function revert(): Promise<void> {
	await AppDataSource.initialize();
	await AppDataSource.undoLastMigration();
	logger.info('Last migration reverted successfully.');
	await AppDataSource.destroy();
}

revert().catch(async (error) => {
	logger.error({ err: error }, 'Failed to revert migration.');

	if (AppDataSource.isInitialized) {
		await AppDataSource.destroy();
	}

	process.exit(1);
});
