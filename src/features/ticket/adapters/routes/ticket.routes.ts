import { Router } from 'express';
import { DataSource } from 'typeorm';

import buildTicketController from '../controllers/ticket.controller';

export default function buildTicketRouter(dataSource: DataSource): Router {
	const router = Router();
	const controller = buildTicketController(dataSource);

	router.post('/', controller.create);
	router.get('/requester/:requesterId', controller.listByRequester);
	router.get('/admin/:adminId', controller.listByAdmin);
	// RF13 remains unavailable; reserve its literal path before the RF09 ID route.
	router.get('/history', (_req, res) => res.sendStatus(404));
	router.get('/:ticketId', controller.getById);
	router.patch('/:ticketId', controller.update);
	router.post('/:ticketId/resolve', controller.resolve);
	router.post('/:ticketId/messages', controller.createMessage);
	return router;
}
