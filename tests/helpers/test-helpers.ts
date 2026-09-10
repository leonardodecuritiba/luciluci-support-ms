import { randomUUID } from 'node:crypto';

import createApp from '../../src/app';
import TestDataSource from '../../src/shared/infrastructure/database/data-source-test';
import IdempotencyKey from '../../src/shared/entities/idempotency-key.entity';
import Department from '../../src/features/department/entities/department.entity';
import DepartmentAllowedUser from '../../src/features/department/entities/department-allowed-user.entity';

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
	const entities = [IdempotencyKey, DepartmentAllowedUser, Department];

	for (const entity of entities) {
		await TestDataSource.getRepository(entity).clear();
	}
}
