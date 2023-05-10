import type { Knex } from 'knex';

import { SSP_DB_HOST, SSP_DB_PASSWORD, SSP_DB_PORT, SSP_DB_USER } from './src/api/envars';

const config: Knex.Config = {
  client: 'mssql',
  connection: {
    server: SSP_DB_HOST,
    port: SSP_DB_PORT,
    database: 'uid2_selfserve',
    user: SSP_DB_USER,
    password: SSP_DB_PASSWORD,
  },
  migrations: {
    directory: './src/database/migrations',
  },
  seeds: {
    directory: './src/database/seeds',
  },
};

export default config;
