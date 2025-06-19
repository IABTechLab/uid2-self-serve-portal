import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	console.log('creating user table migration');
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 256).unique();
    table.string('location', 100);
    table.string('phone', 20);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
