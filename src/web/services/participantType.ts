import axios from 'axios';

import { ParticipantType } from '../../api/entities/ParticipantType';
import { backendError } from '../utils/apiError';

export async function GetAllParticipantTypes() {
  try {
    const result = await axios.get<ParticipantType[]>(`/participantTypes`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get participantTypes');
  }
}
