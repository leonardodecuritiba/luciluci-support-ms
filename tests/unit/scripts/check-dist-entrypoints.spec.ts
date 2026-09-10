import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(__dirname, '../../..');
const checker = path.join(root, 'scripts/check-dist-entrypoints.js');
const expectedEntrypoints = [
	'main.js',
	'shared/infrastructure/database/run-migrations.js',
	'shared/infrastructure/database/revert-migration.js',
];

function writeEntrypoints(directory: string, omitted?: string): void {
	for (const entrypoint of expectedEntrypoints) {
		if (entrypoint === omitted) {
			continue;
		}

		const target = path.join(directory, entrypoint);
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.writeFileSync(target, '// fixture');
	}
}

describe('check-dist-entrypoints', () => {
	it('accepts a production layout containing every runtime entrypoint', () => {
		const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'support-dist-check-'));
		writeEntrypoints(fixture);

		const result = spawnSync(process.execPath, [checker, fixture], { encoding: 'utf8' });

		expect(result.status).toBe(0);
		expect(result.stdout).toContain('Compiled production entrypoints OK');
	});

	it('rejects a layout missing a migration runner', () => {
		const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'support-dist-check-'));
		writeEntrypoints(fixture, 'shared/infrastructure/database/revert-migration.js');

		const result = spawnSync(process.execPath, [checker, fixture], { encoding: 'utf8' });

		expect(result.status).toBe(1);
		expect(result.stderr).toContain('revert-migration.js');
	});
});
