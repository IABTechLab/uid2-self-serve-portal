import axios from 'axios';

import { backendError } from '../utils/apiError';

export async function GetDomainNames(participantId?: number) {
  try {
    const result = await axios.get<string[]>(
      `/participants/${participantId ?? 'current'}/domainNames`
    );
    if (result.status === 200) {
      return result.data;
    }
  } catch (e: unknown) {
    throw backendError(e, 'Could not get domain names');
  }
}

export async function UpdateDomainNames(
  domainNames: string[],
  participantId?: number
): Promise<string[]> {
  try {
    const result = await axios.post<string[]>(
      `/participants/${participantId ?? 'current'}/domainNames`,
      {
        domainNames,
      }
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not set domain names');
  }
}
