import * as Knex from 'knex';

import config from '../knexfile';

if (typeof config.connection === 'string') {
  throw Error(
    'No current support for connection details as string in devSetup.ts, but you should be able to add it easily enough.'
  );
}
const configWithoutDatabaseName = { ...config, connection: { ...config.connection, database: '' } };
const knex = Knex.knex(configWithoutDatabaseName);

(async () => {
  console.log('Disabling implicit transactions...');
  await knex.raw('SET IMPLICIT_TRANSACTIONS OFF');
  console.log('Creating database uid2_selfserve...');
  await knex.raw('CREATE DATABASE uid2_selfserve;');
  console.log('Dev setup complete!');
})().then(() => process.exit());
