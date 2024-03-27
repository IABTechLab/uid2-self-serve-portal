import { Knex } from 'knex';

enum AuditTrailEvents {
  UpdateSharingPermissions = 'UpdateSharingPermissions',
  UpdateSharingTypes = 'UpdateSharingTypes',
  ApproveAccount = 'ApproveAccount',
  ManageKeyPair = 'ManageKeyPair',
  ManageApiKey = 'ManageApiKey',
  AddParticipant = 'AddParticipant',
}

type AuditTrailEventData = {
  siteId: number;
  action: string;
  name: string;
  disabled: boolean;
  participantId: number;
};

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
  const createdAt = approvedAuditTrail.created_at;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const eventData: AuditTrailEventData = JSON.parse(approvedAuditTrail.eventData);
  const { participantId } = eventData;
  await knex('participants').where('id', participantId).update({
    approverId: userId,
    dateApproved: createdAt,
  });
}

function batchUpdateParticipantsWithApprovers(knex: Knex, approvedAuditTrails: AuditTrailDTO[]) {
  const batchUpdatePromises = approvedAuditTrails.map((approvedAuditTrail) => {
    return updateParticipantsRow(approvedAuditTrail, knex);
  });
  return Promise.all(batchUpdatePromises);
}

async function migrateApproverToParticipants(knex: Knex) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const approvedAuditTrails: AuditTrailDTO[] = await knex('auditTrails')
    .where('event', 'ApproveAccount')
    .andWhere('succeeded', 1);

  await batchUpdateParticipantsWithApprovers(knex, approvedAuditTrails);
}

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.integer('approverId');
    table.foreign('approverId').references('users.id');
    table.date('dateApproved');
  });
  await migrateApproverToParticipants(knex);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('participants', (table) => {
    table.dropForeign('approverId');
    table.dropColumn('approverId');
    table.dropColumn('dateApproved');
  });
}
