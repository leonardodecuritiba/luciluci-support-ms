import AppDataSource from './data-source';
import logger from '../logger';

async function run(): Promise<void> {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  logger.info('Migrations executed successfully.');
  await AppDataSource.destroy();
}

run().catch(async (error) => {
  logger.error({ err: error }, 'Failed to run migrations.');

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }

  process.exit(1);
});

