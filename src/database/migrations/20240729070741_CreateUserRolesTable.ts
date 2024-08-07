import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('userRoles', (table) => {
    table.increments('id').primary();
    table.string('roleName', 100).notNullable();
  });

  const userRoleNames = ['Admin', 'Operations', 'UID2 Support'];

  await knex('userRoles').insert(
    userRoleNames.map((role) => {
      return { roleName: role };
    })
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('userRoles');
}
