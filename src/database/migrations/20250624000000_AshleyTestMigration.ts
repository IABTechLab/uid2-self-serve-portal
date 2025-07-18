import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex('userRoles').insert({
		roleName: 'Ashley User',
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex('userRoles').where({ id: 5 }).del();
}
