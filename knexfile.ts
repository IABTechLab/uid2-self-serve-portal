import type { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';

const config: Knex.Config = {
  client: 'mssql',
  connection: {
    server: 'localhost',
    port: 11433,
    database: 'uid2_selfserve',
    user: 'sa',
    password: 'D3velopmentP0',
  },
  migrations: {
    directory: './src/database/migrations',
  },
  seeds: {
    directory: './src/database/seeds',
  },
  ...knexSnakeCaseMappers(),
};

export default config;
