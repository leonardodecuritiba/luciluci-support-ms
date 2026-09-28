import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(__dirname, '../../..');

describe('Support bootstrap S1', () => {
	it('materializes the Support identity and disables messaging explicitly', () => {
		const identity = JSON.parse(
			fs.readFileSync(path.join(root, 'service-identity.json'), 'utf8'),
		) as Record<string, unknown>;
		const packageJson = JSON.parse(
			fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
		) as Record<string, unknown>;

		expect(identity).toMatchObject({
			templateSlug: 'standard-ms',
			serviceSlug: 'support-ms',
			serviceDisplayName: 'Support (Suporte)',
			domainSlug: 'support',
			defaultDbName: 'support_ms',
			defaultTestDbName: 'support_ms_test',
			defaultAsyncApiArtifact: null,
			defaultOpenApiArtifact: 'docs/openapi/v1/support-api.json',
			defaultRabbitMqExchanges: {},
			capabilities: { http: true, messaging: false },
			luciluciDocsPath: './luciluci-docs/support/',
		});
		expect(packageJson.name).toBe('support-ms');
	});

	it('proves that inactive messaging has no runtime wiring or active contract assets', () => {
		const result = spawnSync(process.execPath, ['scripts/check-messaging-disabled.js'], {
			cwd: root,
			encoding: 'utf8',
		});

		expect(result.status).toBe(0);
		expect(result.stdout).toContain('Messaging disabled configuration OK');
	});

	it('refuses an unsafe seed invocation before any database interaction', () => {
		const result = spawnSync(process.execPath, ['-r', 'ts-node/register', 'scripts/seed.ts'], {
			cwd: root,
			encoding: 'utf8',
			env: {
				...process.env,
				NODE_ENV: 'test',
				DB_HOST: 'seed-unreachable.invalid',
				DB_NAME: 'support_s1_proof_seed_bootstrap',
				SUPPORT_SEED_CONFIRM: '',
			},
		});

		expect(result.status).toBe(1);
		expect(result.stderr).toContain('SEED_W1_REFUSED');
		expect(result.stderr).not.toMatch(/ENOTFOUND|ECONNREFUSED|timeout/i);
	});
});
