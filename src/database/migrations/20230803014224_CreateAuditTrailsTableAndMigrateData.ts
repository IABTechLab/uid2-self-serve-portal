/* eslint-disable camelcase */
import { Knex } from 'knex';

enum SharingAction {
  Add = 'add',
  Delete = 'delete',
}

type UpdateSharingPermissionEventData = {
  siteId: number;
  action: SharingAction;
  sharingPermissions: number[];
};

type SharingAuditTrail = {
  action: SharingAction;
  siteIds?: string;
  sharingParticipantSiteId?: number;
  userId: number;
  userEmail: string;
  participantId: number;
  proceed: boolean;
  created_at: Date;
  updated_at: Date;
};

enum AuditTrailEvents {
  UpdateSharingPermissions = 'UpdateSharingPermissions',
}

type AuditTrailEventData = UpdateSharingPermissionEventData;

type AuditTrailDTO = {
  id: number;
  userId: number;
  participantId: number;
  userEmail: string;
  succeeded: boolean;
  event: AuditTrailEvents;
  eventData: AuditTrailEventData;
};

function mapSharingAuditTrailToAuditTrails(
  sharingAuditTrail: SharingAuditTrail
): Omit<AuditTrailDTO, 'id'> & { created_at: Date; updated_at: Date } {
  const eventData: UpdateSharingPermissionEventData = {
    action: sharingAuditTrail.action,
    siteId: 0, // Legacy Data will miss siteId
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    sharingPermissions: JSON.parse(`[${sharingAuditTrail.siteIds!}]`),
  };

  return {
    userId: sharingAuditTrail.userId,
    userEmail: sharingAuditTrail.userEmail,
    participantId: sharingAuditTrail.participantId,
    event: AuditTrailEvents.UpdateSharingPermissions,
    eventData,
    succeeded: sharingAuditTrail.proceed,
    created_at: sharingAuditTrail.created_at,
    updated_at: sharingAuditTrail.updated_at,
  };
}

async function migrateSharingAuditTrails(knex: Knex) {
  const groupByColumns = [
    'userId',
    'userEmail',
    'action',
    'participantId',
    'proceed',
    'updated_at',
    'created_at',
  ];
  const sharingAuditTrails = await knex('sharingAuditTrails')
    .select(knex.raw(`string_agg(sharingParticipantSiteId, ',') siteIds`), ...groupByColumns)
    .groupBy(groupByColumns);
  const auditTrails = sharingAuditTrails.map(mapSharingAuditTrailToAuditTrails);
  if (auditTrails.length > 0) await knex('auditTrails').insert(auditTrails);
}

function mapAuditTrailsToSharingAuditTrails(
  auditTrail: AuditTrailDTO & { created_at: Date; updated_at: Date }
): SharingAuditTrail[] {
  // Has to parse the field as knex return it as string
  const eventData = JSON.parse(
    auditTrail.eventData as unknown as string
  ) as UpdateSharingPermissionEventData;
  return eventData.sharingPermissions.map((siteId) => ({
    action: eventData.action,
    userId: auditTrail.userId,
    userEmail: auditTrail.userEmail,
    participantId: auditTrail.participantId,
    sharingParticipantSiteId: siteId,
    proceed: auditTrail.succeeded,
    created_at: auditTrail.created_at,
    updated_at: auditTrail.updated_at,
  }));
}

async function migrateAuditTrails(knex: Knex) {
  // We could only migrate UpdateSharingPermissions data back into sharingAuditTrails
  const auditTrails = await knex<AuditTrailDTO & { created_at: Date; updated_at: Date }>(
    'AuditTrails'
  ).where('event', AuditTrailEvents.UpdateSharingPermissions);

  const sharingAuditTrails: SharingAuditTrail[] = [];
  auditTrails.forEach((at) => {
    sharingAuditTrails.push(...mapAuditTrailsToSharingAuditTrails(at));
  });
  await knex('sharingAuditTrails').insert(sharingAuditTrails);
}

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('auditTrails', (table) => {
    table.increments('id').primary();
    table.integer('participantId').references('participants.id');
    table.integer('userId').references('users.id');
    table.string('userEmail');
    table.string('event');
    table.jsonb('eventData');
    table.boolean('succeeded').defaultTo(false);
    table.timestamps(true, true);
  });

  await migrateSharingAuditTrails(knex);
  await knex.schema.dropTable('sharingAuditTrails');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable('sharingAuditTrails', (table) => {
    table.increments('id').primary();
    table.integer('participantId').references('participants.id');
    table.integer('userId').references('users.id');
    table.string('userEmail');
    table.integer('sharingParticipantSiteId');
    table.enu('action', ['add', 'delete']);
    table.boolean('proceed').defaultTo(false);
    table.timestamps(true, true);
  });
  await migrateAuditTrails(knex);
  await knex.schema.dropTable('auditTrails');
}
