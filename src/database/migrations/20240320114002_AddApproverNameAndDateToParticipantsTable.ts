import { Knex } from 'knex';

export enum AuditTrailEvents {
  UpdateSharingPermissions = 'UpdateSharingPermissions',
  UpdateSharingTypes = 'UpdateSharingTypes',
  ApproveAccount = 'ApproveAccount',
  ManageKeyPair = 'ManageKeyPair',
  ManageApiKey = 'ManageApiKey',
  AddParticipant = 'AddParticipant',
}

type AuditTrailDTO = {
  id: number;
  userId: number;
  userEmail: string;
  succeeded: boolean;
  event: AuditTrailEvents;
  eventData: string;
  created_at: Date;
  updated_at: Date;
};

async function updateParticipantsRow(approvedAuditTrail: AuditTrailDTO, knex: Knex) {
  const { userId } = approvedAuditTrail;
  const { created_at } = approvedAuditTrail;
  const { participantId } = JSON.parse(approvedAuditTrail.eventData);
  await knex('participants').where('id', participantId).update({
    approverId: userId,
    dateApproved: created_at,
  });
}

function batchUpdateParticipantsWithApprovers(knex: Knex, approvedAuditTrails: AuditTrailDTO[]) {
  const batchUpdatePromises = approvedAuditTrails.map((approvedAuditTrail) => {
    return updateParticipantsRow(approvedAuditTrail, knex);
  });
  return Promise.all(batchUpdatePromises);
}

async function migrateApproverToParticipants(knex: Knex) {
  const approvedAuditTrails: AuditTrailDTO[] = await knex('auditTrails')
    .where('event', 'ApproveAccount')
    .andWhere('succeeded', 1);

  await batchUpdateParticipantsWithApprovers(knex, approvedAuditTrails);
}

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.integer('approverId');
    table.date('dateApproved');
  });
  await migrateApproverToParticipants(knex);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.dropColumn('approverId');
    table.dropColumn('dateApproved');
  });
}
