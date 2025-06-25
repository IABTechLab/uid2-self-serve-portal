import type { Knex } from 'knex';
import knex from 'knex';
import { Model } from 'objection';

const config: Knex.Config = {
  client: 'better-sqlite3',
  connection: {
    filename: ':memory:',
  },
  migrations: {
    directory: './src/database/migrations',
  },
  useNullAsDefault: true,
};

export async function TestConfigure(): Promise<Knex> {
  const knexInstance = knex(config);
  Model.knex(knexInstance);

  await knexInstance.migrate.latest();

  return knexInstance;
}
