import axios from 'axios';

import { AuditTrailDTO } from '../../api/entities/AuditTrail';
import { mapClientTypeIdsToAdminEnums } from '../../api/services/adminServiceHelpers';
import { backendError } from '../utils/apiError';
import { getRoleNamesByIds } from '../utils/apiRoles';
import { camelCaseToSpaced } from '../utils/textHelpers';

export const GetAuditTrail = async (participantId: number) => {
  try {
    const result = await axios.get<AuditTrailDTO[]>(`/participants/${participantId}/auditTrail`);
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get audit trail.');
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
    }
    const formattedKey = key.toLowerCase().includes('siteid') ? 'Site ID' : camelCaseToSpaced(key);
    outputArray.push(`${formattedKey}: ${val}`);
  }
  const outputString = outputArray.join(' | ');
  return outputString;
};
