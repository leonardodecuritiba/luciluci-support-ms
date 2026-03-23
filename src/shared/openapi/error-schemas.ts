/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Public authentication uses Bearer JWT issued by Identity MS. Token validation and enforcement are handled upstream by the API Gateway/BFF.
 *   schemas:
 *     ErrorItem:
 *       type: object
 *       required: [code]
 *       properties:
 *         field:
 *           type: string
 *         code:
 *           type: string
 *         message:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       required: [status_code, message]
 *       properties:
 *         status_code:
 *           type: integer
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ErrorItem'
 *     Pagination:
 *       type: object
 *       required: [page, limit, total, totalPages]
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         totalPages:
 *           type: integer
 *   responses:
 *     BadRequestResponse:
 *       description: Request payload or headers are invalid for this operation
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     UnauthorizedResponse:
 *       description: Authentication context is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     ForbiddenResponse:
 *       description: Authenticated caller lacks the required role or scope
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     NotFoundResponse:
 *       description: Requested resource was not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     ConflictResponse:
 *       description: Request conflicts with persisted state or idempotency guarantees
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     PayloadTooLargeResponse:
 *       description: Uploaded payload exceeded the supported size
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     UnsupportedMediaResponse:
 *       description: Uploaded media type is not supported
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     ValidationErrorResponse:
 *       description: Request payload failed semantic validation
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     InternalErrorResponse:
 *       description: Unexpected internal server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *   parameters:
 *     CorrelationIdHeader:
 *       in: header
 *       name: X-Correlation-ID
 *       schema:
 *         type: string
 *         format: uuid
 *       description: Required end-to-end correlation identifier propagated across HTTP, logs and events.
 *       required: true
 *     IdempotencyKeyHeader:
 *       in: header
 *       name: X-Idempotency-Key
 *       schema:
 *         type: string
 *       required: true
 *     PerformedByHeader:
 *       in: header
 *       name: X-Performed-By
 *       schema:
 *         type: string
 *       required: false
 *     PerformedByTypeHeader:
 *       in: header
 *       name: X-Performed-By-Type
 *       schema:
 *         type: string
 *       required: false
 */
export {};
