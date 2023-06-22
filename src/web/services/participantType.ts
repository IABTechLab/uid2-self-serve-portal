import axios from 'axios';

import { backendError } from '../utils/apiError';

export type ParticipantTypeResponse = {
  id: number;
  typeName: string;
};
export async function GetAllParticipantTypes() {
  try {
    const result = await axios.get<ParticipantTypeResponse[]>(`/participantTypes`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get participantTypes');
  }
}
