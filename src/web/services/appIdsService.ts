import axios from 'axios';

import { backendError } from '../utils/apiError';

export type AddAppIdsFormProps = {
  newAppIds: string;
};

export type EditAppIdFormProps = {
  appId: string;
};

export async function GetAppIds(participantId?: number) {
  try {
    const result = await axios.get<string[]>(
      `/participants/${participantId ?? 'current'}/appNames`
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get app ids');
  }
}

export async function UpdateAppIds(appNames: string[], participantId?: number): Promise<string[]> {
  try {
    const result = await axios.post<string[]>(
      `/participants/${participantId ?? 'current'}/appNames`,
      {
        appNames,
      }
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not set app ids');
  }
}
