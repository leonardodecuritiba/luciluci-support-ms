import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/tests'],
	setupFilesAfterEnv: ['<rootDir>/tests/setup-tests.ts'],
	moduleFileExtensions: ['ts', 'js', 'json'],
	collectCoverageFrom: ['src/**/*.ts', '!src/main.ts'],
	coverageDirectory: 'coverage',
	clearMocks: true,
};

export default config;
