import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

import { eventSchemaRegistry } from '../../src/shared/infrastructure/events/event-schema-registry';
import { KnownEventType } from '../../src/shared/infrastructure/events/event-types';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validatorCache = new Map<string, ValidateFunction>();

function getValidator(eventType: KnownEventType): ValidateFunction {
  if (validatorCache.has(eventType)) {
    return validatorCache.get(eventType)!;
  }

  const eventInfo = eventSchemaRegistry.getSchema(eventType);

  if (!eventInfo) {
    throw new Error(`Event type '${eventType}' not found.`);
  }

  const validator = ajv.compile(eventInfo.schema);
  validatorCache.set(eventType, validator);
  return validator;
}

export function validateEventPayload(
  eventType: KnownEventType,
  payload: Record<string, unknown>,
): { valid: boolean; errors: string[] } {
  const validator = getValidator(eventType);
  const valid = validator(payload);

  if (valid) {
    return { valid: true, errors: [] };
  }

  return {
    valid: false,
    errors:
      validator.errors?.map((error) => {
        const path = error.instancePath || error.schemaPath;
        return `${path}: ${error.message}`;
      }) ?? [],
  };
}

export function validateRabbitMQHeaders(headers: {
  messageId?: string;
  correlationId?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!headers.messageId) {
    errors.push('messageId is required');
  }

  if (!headers.correlationId || !uuidRegex.test(headers.correlationId)) {
    errors.push('correlationId must be a valid UUID');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

