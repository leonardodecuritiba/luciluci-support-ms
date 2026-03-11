/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       required: [code, message, statusCode, correlationId]
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *         statusCode:
 *           type: integer
 *         correlationId:
 *           type: string
 *           format: uuid
 *         details:
 *           type: object
 *           additionalProperties: true
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
 *   parameters:
 *     CorrelationIdHeader:
 *       in: header
 *       name: X-Correlation-ID
 *       schema:
 *         type: string
 *         format: uuid
 *       required: false
 *     IdempotencyKeyHeader:
 *       in: header
 *       name: Idempotency-Key
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
