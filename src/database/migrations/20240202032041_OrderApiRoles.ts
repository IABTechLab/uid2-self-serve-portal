import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('apiRoles', (table) => {
    table.integer('order').defaultTo(100).notNullable();
  });

  const roleOrders = [
    { role: 'MAPPER', order: 1 },
    { role: 'GENERATOR', order: 2 },
    { role: 'SHARER', order: 3 },
    { role: 'ID_READER', order: 4 },
  ];

  const promises = [];
  for (const roleOrder of roleOrders) {
    promises.push(
      knex('apiRoles').where('roleName', roleOrder.role).update({ order: roleOrder.order })
    );
  }

  await Promise.all(promises);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('apiRoles', (table) => {
    table.dropColumn('order');
  });
}
