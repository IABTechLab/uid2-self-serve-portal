import * as Knex from 'knex';
import { Model } from 'objection';

const config: Knex.Knex.Config = {
  client: 'better-sqlite3',
  connection: {
    filename: ':memory:',
  },
  migrations: {
    directory: './src/database/migrations',
  },

  useNullAsDefault: true,
};

export async function TestConfigure(): Promise<void> {
  const knex = Knex.knex(config);
  Model.knex(knex);

  await knex.migrate.latest();
}
