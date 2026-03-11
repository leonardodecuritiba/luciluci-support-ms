import { Router } from 'express';
import { DataSource } from 'typeorm';

import createIdempotencyMiddleware from '../../../../shared/kernel/middlewares/idempotency.middleware';
import IdempotencyService from '../../../../shared/services/idempotency.service';
import buildProfileController from '../controllers/profile.controller';

export default function buildProfileRouter(dataSource: DataSource): Router {
	const router = Router();
	const controller = buildProfileController(dataSource);
	const idempotencyMiddleware = createIdempotencyMiddleware(new IdempotencyService(dataSource));

	/**
	 * @openapi
	 * /profiles:
	 *   post:
	 *     summary: Create a profile
	 *     tags: [Profiles]
	 *     parameters:
	 *       - $ref: '#/components/parameters/CorrelationIdHeader'
	 *       - $ref: '#/components/parameters/IdempotencyKeyHeader'
	 *       - $ref: '#/components/parameters/PerformedByHeader'
	 *       - $ref: '#/components/parameters/PerformedByTypeHeader'
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/CreateProfileRequestDTO'
	 *     responses:
	 *       201:
	 *         description: Profile created
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 profileId:
	 *                   type: string
	 *                   format: uuid
	 *       400:
	 *         description: Invalid request
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorResponse'
	 *       409:
	 *         description: Idempotency or externalId conflict
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorResponse'
	 */
	router.post('/', idempotencyMiddleware, controller.create);

	/**
	 * @openapi
	 * /profiles/{profileId}:
	 *   patch:
	 *     summary: Update editable profile fields
	 *     tags: [Profiles]
	 *     parameters:
	 *       - $ref: '#/components/parameters/CorrelationIdHeader'
	 *       - $ref: '#/components/parameters/IdempotencyKeyHeader'
	 *       - $ref: '#/components/parameters/PerformedByHeader'
	 *       - $ref: '#/components/parameters/PerformedByTypeHeader'
	 *       - in: path
	 *         name: profileId
	 *         required: true
	 *         schema:
	 *           type: string
	 *           format: uuid
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UpdateProfileRequestDTO'
	 *     responses:
	 *       200:
	 *         description: Profile updated
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 profileId:
	 *                   type: string
	 *                   format: uuid
	 *                 updatedFields:
	 *                   type: array
	 *                   items:
	 *                     type: string
	 *                 updatedAt:
	 *                   type: string
	 *                   format: date-time
	 *       404:
	 *         description: Profile not found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorResponse'
	 */
	router.patch('/:profileId', idempotencyMiddleware, controller.update);

	/**
	 * @openapi
	 * /profiles:
	 *   get:
	 *     summary: List profiles with filters
	 *     tags: [Profiles]
	 *     parameters:
	 *       - $ref: '#/components/parameters/CorrelationIdHeader'
	 *       - in: query
	 *         name: page
	 *         schema:
	 *           type: integer
	 *       - in: query
	 *         name: limit
	 *         schema:
	 *           type: integer
	 *       - in: query
	 *         name: status
	 *         schema:
	 *           type: string
	 *       - in: query
	 *         name: externalId
	 *         schema:
	 *           type: string
	 *       - in: query
	 *         name: classificationIdSnapshot
	 *         schema:
	 *           type: string
	 *       - in: query
	 *         name: displayName
	 *         schema:
	 *           type: string
	 *       - in: query
	 *         name: email
	 *         schema:
	 *           type: string
	 *       - in: query
	 *         name: entityType
	 *         schema:
	 *           type: string
	 *       - in: query
	 *         name: sortBy
	 *         schema:
	 *           type: string
	 *       - in: query
	 *         name: order
	 *         schema:
	 *           type: string
	 *           enum: [ASC, DESC]
	 *     responses:
	 *       200:
	 *         description: Paginated profile list
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ListProfilesResponse'
	 */
	router.get('/', controller.list);

	/**
	 * @openapi
	 * /profiles/by-external-id/{externalId}:
	 *   get:
	 *     summary: Find profile by externalId
	 *     tags: [Profiles]
	 *     parameters:
	 *       - $ref: '#/components/parameters/CorrelationIdHeader'
	 *       - in: path
	 *         name: externalId
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: Profile found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ProfileResponse'
	 *       404:
	 *         description: Profile not found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ErrorResponse'
	 */
	router.get('/by-external-id/:externalId', controller.findByExternalId);

	return router;
}
