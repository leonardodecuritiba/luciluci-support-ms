import { Router } from 'express';
import { DataSource } from 'typeorm';

import buildTicketController from '../controllers/ticket.controller';

export default function buildTicketRouter(dataSource: DataSource): Router {
	const router = Router();
	const controller = buildTicketController(dataSource);

	router.post('/', controller.create);
	router.patch('/:ticketId', controller.update);
	return router;
}
