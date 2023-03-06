import axios from 'axios';

import { ParticipantType } from '../../api/entities/ParticipantType';

export async function GetAllParticipantTypes() {
  const result = await axios.get<ParticipantType[]>(`/participantTypes`);
  if (result.status === 200) {
    return result.data;
  }
  throw Error('Could not get participantTypes');
}
