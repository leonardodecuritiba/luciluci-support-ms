import 'reflect-metadata';

import path from 'path';
import { DataSource } from 'typeorm';

import { env } from '../../utils/env';
import { databaseEntities } from './entities';

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

