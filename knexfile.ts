import type { Knex } from 'knex';

const config: Knex.Config = {
  client: 'mssql',
  connection: {
    server: 'localhost',
    port: 11433,
    database: 'uid2_selfserve',
    user: 'sa',
    password: 'example_password_for_development',
  },
  migrations: {
    directory: './src/database/migrations',
  },
  seeds: {
    directory: './src/database/seeds',
  },
};

export default config;
