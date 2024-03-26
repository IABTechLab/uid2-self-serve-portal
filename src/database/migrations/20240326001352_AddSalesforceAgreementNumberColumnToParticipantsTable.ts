import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.string('salesforceAgreementNumber', 20);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.dropColumn('salesforceAgreementNumber');
  });
}
