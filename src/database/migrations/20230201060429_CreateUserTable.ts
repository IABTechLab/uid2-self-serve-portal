import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Creating users table...');
  await knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('email', 256);
    table.string('name', 200);
    table.string('location', 100);
    table.string('phone', 20);
  });
  console.log('Created users table.');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
