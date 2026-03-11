import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { databaseEntities } from './entities';

const TestDataSource = new DataSource({
	type: 'sqlite',
	database: ':memory:',
	entities: databaseEntities,
	synchronize: true,
	logging: false,
});

export default TestDataSource;
