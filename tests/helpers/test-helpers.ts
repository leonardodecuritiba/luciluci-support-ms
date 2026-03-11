import { randomUUID } from 'node:crypto';

import createApp from '../../src/app';
import TestDataSource from '../../src/shared/infrastructure/database/data-source-test';
import AuditLog from '../../src/shared/entities/audit-log.entity';
import IdempotencyKey from '../../src/shared/entities/idempotency-key.entity';
import OutboxEvent from '../../src/shared/entities/outbox-event.entity';
import ProcessedMessage from '../../src/shared/entities/processed-message.entity';
import Profile from '../../src/features/profile/entities/profile.entity';

export function generateTestUuid(): string {
	return randomUUID();
}

export function buildTestApp() {
	return createApp(TestDataSource);
}

export async function initializeTestDataSource(): Promise<void> {
	if (!TestDataSource.isInitialized) {
		await TestDataSource.initialize();
	}
}

export async function destroyTestDataSource(): Promise<void> {
	if (TestDataSource.isInitialized) {
		await TestDataSource.destroy();
	}
}

export async function clearDatabase(): Promise<void> {
	const entities = [ProcessedMessage, AuditLog, OutboxEvent, IdempotencyKey, Profile];

	for (const entity of entities) {
		await TestDataSource.getRepository(entity).clear();
	}
}
