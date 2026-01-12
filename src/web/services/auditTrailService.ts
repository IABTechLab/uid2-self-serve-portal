import axios from 'axios';

import { AuditTrailDTO, AuditTrailEvents } from '../../api/entities/AuditTrail';
import { mapClientTypeIdsToAdminEnums } from '../../api/services/adminServiceHelpers';
import { backendError } from '../utils/apiError';
import { getRoleNamesByIds } from '../utils/apiRoles';
import { camelCaseToSpaced } from '../utils/textHelpers';

export const GetParticipantAuditTrail = async (participantId: number) => {
  try {
    const result = await axios.get<AuditTrailDTO[]>(`/participants/${participantId}/auditTrail`);
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get participant audit trail.');
  }
};

export const GetUserAuditTrail = async (userId: number) => {
  try {
    const result = await axios.get<AuditTrailDTO[]>(`/manage/${userId}/auditTrail`);
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get user audit trail.');
  }
};

export const getPrettyAuditDetails = (eventData: unknown) => {
  const data = eventData as Record<string, unknown>;
  const outputArray = [];
  for (const key of Object.keys(data)) {
    let val = data[key];
    // make data more human-readable
    if (key.toLowerCase().includes('apiroles')) {
      const apiRoleData = val as string[];
      // some audit records use ids rather than names for the roles
      if (apiRoleData.length > 0 && !isNaN(Number(apiRoleData[0]))) {
        val = getRoleNamesByIds(val as number[]);
      }
    } else if (key.toLowerCase().includes('participanttypes')) {
      const typeData = val as string[];
      // some audit records use ids rather than names for the types
      if (typeData.length > 0 && !isNaN(Number(typeData[0]))) {
        val = mapClientTypeIdsToAdminEnums(val as number[]);
      }
    } else if (key.toLowerCase().includes('action')) {
      val = camelCaseToSpaced(val as string);
    } else if (key.toLowerCase() === 'sharingpermissions') {
      // Handle both old format (siteIds as numbers) and new format (names as strings)
      const sharingData = val as (string | number)[];
      if (sharingData.length > 0 && typeof sharingData[0] === 'number') {
        // Old format: array of siteIds - display as "Site ID: X, Y, Z"
        val = `Site IDs: ${sharingData.join(', ')}`;
      } else {
        // New format: array of participant/site names
        val = sharingData.join(', ');
      }
    }
    const formattedKey = key.toLowerCase().includes('siteid') ? 'Site ID' : camelCaseToSpaced(key);
    outputArray.push(`${formattedKey}: ${val}`);
  }
  const outputString = outputArray.join(' | ');
  return outputString;
};

export const getFormattedEvent = (event: AuditTrailEvents) => {
  let formattedEvent = event.replace(/([a-z])([A-Z])/g, '$1 $2');
  if (formattedEvent.includes('Api')) {
    formattedEvent = formattedEvent.replace(/\bApi\b/g, 'API');
  }
  return formattedEvent;
};
