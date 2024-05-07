import axios from 'axios';

import { SignedParticipantDTO } from '../../api/entities/SignedParticipant';
import { backendError } from '../utils/apiError';

export async function GetAllSignedParticipants() {
  try {
    const result = await axios.get<SignedParticipantDTO[]>(`/signedParticipant`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get signed participants');
  }
}
