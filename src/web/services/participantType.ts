import axios from 'axios';

import { ParticipantTypeDTO } from '../../api/entities/ParticipantType';
import { backendError } from '../utils/apiError';

export async function GetAllParticipantTypes() {
  try {
    const result = await axios.get<ParticipantTypeDTO[]>(`/participantTypes`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get participantTypes');
  }
}
