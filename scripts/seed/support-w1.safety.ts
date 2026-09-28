export class W1SeedError extends Error {
	constructor(
		readonly marker:
			| 'SEED_W1_REFUSED'
			| 'W1_SCHEMA_NOT_READY'
			| 'SEED_W1_DIVERGENT'
			| 'SEED_W1_FAILED',
		message: string,
	) {
		super(message);
		this.name = 'W1SeedError';
	}
}

export interface W1Identity {
	serviceSlug?: unknown;
	domainSlug?: unknown;
}

export function validateW1Preconnection(
	variables: NodeJS.ProcessEnv,
	identity: W1Identity,
): { database: string; environment: 'development' | 'test' } {
	if (variables.SUPPORT_SEED_CONFIRM !== 'W1_DISPOSABLE') {
		throw new W1SeedError('SEED_W1_REFUSED', 'SUPPORT_SEED_CONFIRM must equal W1_DISPOSABLE');
	}
	const environment = variables.NODE_ENV;
	if (environment !== 'development' && environment !== 'test') {
		throw new W1SeedError('SEED_W1_REFUSED', 'NODE_ENV must explicitly be development or test');
	}
	const database = variables.DB_NAME;
	if (!database) throw new W1SeedError('SEED_W1_REFUSED', 'DB_NAME must be explicit');
	const approvedName =
		environment === 'development'
			? /^support_seed_local_[A-Za-z0-9_]+$/.test(database)
			: /^support_s1_(proof|ci)_seed_[A-Za-z0-9_]+$/.test(database);
	if (!approvedName) {
		throw new W1SeedError('SEED_W1_REFUSED', 'DB_NAME lacks the approved disposable W1 prefix');
	}
	// Both the local compose port and the CI PostgreSQL service are reached through loopback.
	// A safe-looking database name on a remote/shared host is not a disposable target.
	if (variables.DB_HOST !== '127.0.0.1' && variables.DB_HOST !== '::1') {
		throw new W1SeedError('SEED_W1_REFUSED', 'DB_HOST must explicitly be a loopback address');
	}
	if (!identity || identity.serviceSlug !== 'support-ms' || identity.domainSlug !== 'support') {
		throw new W1SeedError('SEED_W1_REFUSED', 'Support service identity mismatch');
	}
	return { database, environment };
}
