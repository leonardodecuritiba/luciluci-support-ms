import request from 'supertest';
import { OpenAPIV3 } from 'openapi-types';

import swaggerSpec from '../../../src/shared/openapi/swagger';
import { buildTestApp, clearDatabase, destroyTestDataSource, initializeTestDataSource } from '../../helpers/test-helpers';

describe('Contract: OpenAPI', () => {
  beforeAll(async () => {
    await initializeTestDataSource();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await destroyTestDataSource();
  });

  it('documents the canonical profile endpoints', () => {
    const spec = swaggerSpec as OpenAPIV3.Document;

    expect(spec.paths?.['/profiles']?.post).toBeDefined();
    expect(spec.paths?.['/profiles']?.get).toBeDefined();
    expect(spec.paths?.['/profiles/{profileId}']?.patch).toBeDefined();
    expect(spec.paths?.['/profiles/by-external-id/{externalId}']?.get).toBeDefined();
  });

  it('returns an error shape documented by the contract for invalid create requests', async () => {
    const app = buildTestApp();

    const response = await request(app)
      .post('/profiles')
      .set('Idempotency-Key', 'openapi-key')
      .send({
        externalId: 'profile-001',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        code: 'INVALID_INPUT',
        message: 'Invalid input data.',
        correlationId: expect.any(String),
      }),
    );
  });

  it('returns a documented 404 error for unknown externalId lookups', async () => {
    const app = buildTestApp();

    const response = await request(app).get('/profiles/by-external-id/not-found');

    expect(response.status).toBe(404);
    expect(response.body.code).toBe('PROFILE_NOT_FOUND');
  });
});

