/* eslint-disable camelcase */
import { Knex } from 'knex';

type UpdateSharingPermissionEventData = {
  siteId: number;
  action: string;
  sharingPermissions: number[] | string[];
};

type AuditTrailRow = {
  id: number;
  eventData: string; // JSON string in database
};

type ParticipantRow = {
  siteId: number;
  name: string | null;
  id: number;
};

/**
 * Migration to update old audit logs: convert site IDs to participant names/IDs
 *
 */
export async function up(knex: Knex): Promise<void> {
  // Get all UpdateSharingPermissions audit logs
  const auditLogs = await knex<AuditTrailRow>('auditTrails')
    .where('event', 'UpdateSharingPermissions')
    .select('id', 'eventData');

  // Get all participants with their siteIds for lookup
  const participants = (await knex<ParticipantRow>('participants')
    .whereNotNull('siteId')
    .select('siteId', 'name', 'id')) as ParticipantRow[];

  // Create a map: siteId -> display name (participant name or participant ID)
  const siteIdToNameMap = new Map<number, string>();
  participants.forEach((p) => {
    if (p.siteId) {
      const displayName = p.name || `Participant ${p.id}`;
      siteIdToNameMap.set(p.siteId, displayName);
    }
  });

  // Process each audit log
  const updatePromises = auditLogs.map(async (log) => {
    const eventData = JSON.parse(log.eventData) as UpdateSharingPermissionEventData;

    // Check if sharingPermissions is an array of numbers (old format)
    if (
      Array.isArray(eventData.sharingPermissions) &&
      eventData.sharingPermissions.length > 0 &&
      typeof eventData.sharingPermissions[0] === 'number'
    ) {
      // Convert site IDs to participant names/IDs
      const siteIds = eventData.sharingPermissions as number[];
      const names = siteIds.map((siteId) => {
        // Use participant name if available, otherwise participant ID
        // If no participant exists (participant was deleted), use Site ID as fallback
        return siteIdToNameMap.get(siteId) ?? `Site ${siteId}`;
      });

      // Update eventData with new format
      const updatedEventData: UpdateSharingPermissionEventData = {
        ...eventData,
        sharingPermissions: names,
      };

      // Update the database
      await knex('auditTrails')
        .where('id', log.id)
        .update({
          eventData: JSON.stringify(updatedEventData),
        });
    }
  });

  await Promise.all(updatePromises);
}

export async function down(knex: Knex): Promise<void> {
  // Get all UpdateSharingPermissions audit logs
  const auditLogs = await knex<AuditTrailRow>('auditTrails')
    .where('event', 'UpdateSharingPermissions')
    .select('id', 'eventData');

  // Get all participants with their siteIds for lookup
  const participants = (await knex<ParticipantRow>('participants')
    .whereNotNull('siteId')
    .select('siteId', 'name', 'id')) as ParticipantRow[];

  // Create maps: name -> siteId, participantId -> siteId
  const nameToSiteIdMap = new Map<string, number>();
  const participantIdToSiteIdMap = new Map<number, number>();
  participants.forEach((p) => {
    if (p.siteId) {
      if (p.name) {
        nameToSiteIdMap.set(p.name, p.siteId);
      }
      participantIdToSiteIdMap.set(p.id, p.siteId);
    }
  });

  // Process each audit log to convert back to site IDs
  const updatePromises = auditLogs.map(async (log) => {
    const eventData = JSON.parse(log.eventData) as UpdateSharingPermissionEventData;

    // Check if sharingPermissions is an array of strings (new format)
    if (
      Array.isArray(eventData.sharingPermissions) &&
      eventData.sharingPermissions.length > 0 &&
      typeof eventData.sharingPermissions[0] === 'string'
    ) {
      // Convert participant names/IDs back to site IDs
      const names = eventData.sharingPermissions as string[];
      const siteIds = names.map((name) => {
        // Try to resolve from name
        if (nameToSiteIdMap.has(name)) {
          return nameToSiteIdMap.get(name)!;
        }
        // Try to resolve from "Participant X" format
        const participantMatch = name.match(/^Participant (\d+)$/);
        if (participantMatch) {
          const participantId = Number.parseInt(participantMatch[1], 10);
          if (participantIdToSiteIdMap.has(participantId)) {
            return participantIdToSiteIdMap.get(participantId)!;
          }
        }
        // Try to extract from "Site X" format
        const siteMatch = name.match(/^Site (\d+)$/);
        if (siteMatch) {
          return Number.parseInt(siteMatch[1], 10);
        }
        // Cannot resolve - use 0 as placeholder (data loss)
        return 0;
      });

      // Update eventData back to old format
      const revertedEventData: UpdateSharingPermissionEventData = {
        ...eventData,
        sharingPermissions: siteIds,
      };

      await knex('auditTrails')
        .where('id', log.id)
        .update({
          eventData: JSON.stringify(revertedEventData),
        });
    }
  });

  await Promise.all(updatePromises);
}
