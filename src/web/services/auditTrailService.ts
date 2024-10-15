import axios from 'axios';

import { AuditTrailDTO, AuditTrailEvents } from '../../api/entities/AuditTrail';
import { mapClientTypeIdsToAdminEnums } from '../../api/services/adminServiceHelpers';
import { backendError } from '../utils/apiError';
import { getRoleNamesByIds } from '../utils/apiRoles';

export const GetAuditLogs = async (participantId: number) => {
  try {
    const result = await axios.get<AuditTrailDTO[]>(`/participants/${participantId}/auditTrail`);
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get audit trail.');
  }
};

export const getPrettyAuditDetails = (eventType: AuditTrailEvents, eventData: unknown) => {
  const data = eventData as Record<string, unknown>;
  const outputArray = [];
  // eslint-disable-next-line guard-for-in
  for (const key in data) {
    let val = data[key];
    // make data more human-readable
    if (key.toLowerCase().indexOf('apiroles') > -1) {
      const apiRoleData = val as string[];
      // some audit records use ids rather than names for the roles
      if (apiRoleData.length > 0 && !isNaN(Number(apiRoleData[0]))) {
        val = getRoleNamesByIds(val as number[]);
      }
    } else if (key.toLowerCase().indexOf('participanttypes') > -1) {
      const typeData = val as string[];
      // some audit records use ids rather than names for the types
      if (typeData.length > 0 && !isNaN(Number(typeData[0]))) {
        val = mapClientTypeIdsToAdminEnums(val as number[]);
      }
    }
    // convert key from camelCase
    outputArray.push(
      `${key[0].toUpperCase() + key.substring(1).replace(/([a-z])([A-Z])/g, '$1 $2')}: ${val}`
    );
  }
  const outputString = outputArray.join(' | ');
  return outputString;
};
