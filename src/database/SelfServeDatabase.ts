import knex from 'knex';
import { Model } from 'objection';

import config from '../../knexfile.ts';

export function Configure(): void {
  const knexInstance = knex(config);
  Model.knex(knexInstance);
}
