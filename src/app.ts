import cors from 'cors';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { DataSource } from 'typeorm';

import createErrorHandler from './shared/kernel/middlewares/error-handler';
import correlationIdMiddleware from './shared/kernel/middlewares/correlation-id.middleware';
import loggerMiddleware from './shared/kernel/middlewares/logger.middleware';
import metricsMiddleware from './shared/kernel/middlewares/metrics.middleware';
import performedByMiddleware from './shared/kernel/middlewares/performed-by.middleware';
import { metricsRegistry } from './shared/infrastructure/metrics/registry';
import swaggerSpec from './shared/openapi/swagger';
import buildDepartmentRouter from './features/department/adapters/routes/department.routes';

export default function createApp(dataSource: DataSource): Express {
	const app = express();

	app.use(cors());
	app.use(correlationIdMiddleware);
	app.use(express.json());
	app.use(performedByMiddleware);
	app.use(metricsMiddleware);
	app.use(loggerMiddleware);

	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	app.get('/api-docs-json', (_req, res) => {
		res.status(200).json(swaggerSpec);
	});
	app.get('/metrics', async (_req, res) => {
		res.setHeader('Content-Type', metricsRegistry.contentType);
		res.status(200).send(await metricsRegistry.metrics());
	});
	app.get('/health', (_req, res) => {
		res.status(200).json({
			status: 'ok',
			timestamp: new Date().toISOString(),
			database: dataSource.isInitialized,
			messaging: {
				enabled: false,
				status: 'not_applicable',
			},
		});
	});
	app.use('/api/support/departments', buildDepartmentRouter(dataSource));

	app.use(createErrorHandler(dataSource));

	return app;
}
