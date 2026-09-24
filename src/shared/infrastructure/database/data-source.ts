import 'reflect-metadata';

import path from 'path';
import pg from 'pg';
import { DataSource } from 'typeorm';

import { env } from '../../utils/env';
import { databaseEntities } from './entities';

// Support stores UTC instants in PostgreSQL timestamp columns. Keep pg's input
// and output conversion independent of the host process timezone.
pg.defaults.parseInputDatesAsUTC = true;
pg.types.setTypeParser(1114, (value) => new Date(`${value.replace(' ', 'T')}Z`));

const AppDataSource = new DataSource({
	type: 'postgres',
	host: env.db.host,
	port: env.db.port,
	username: env.db.username,
	password: env.db.password,
	database: env.db.database,
	entities: databaseEntities,
	migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
	synchronize: false,
	logging: false,
});

export default AppDataSource;
