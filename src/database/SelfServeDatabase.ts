import * as Knex from 'knex';
import { Model } from 'objection';

import config from '../../knexfile';

export function Configure(): void {
  const knex = Knex.knex(config);
  Model.knex(knex);
}
