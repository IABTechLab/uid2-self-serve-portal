import { AxiosInstance } from 'axios';
import { createContext } from 'react';

import { Participant } from '../../api/entities/Participant';

type PariticipantWithSetter = {
  participant: Participant | null;
  setParticipant: (account: Participant | null) => void;
};
export const ParticipantContext = createContext<PariticipantWithSetter>({
  participant: null,
  setParticipant: () => {
    throw Error('No participant context available');
  },
});

async function GetParticipantByUserId(apiClient: AxiosInstance | undefined, id: string) {
  if (!apiClient) throw Error('Unauthorized');
  const result = await apiClient.get<Participant>(`/users/${id}`);
  if (result.status === 200) {
    return result.data;
  }
  throw Error('Could not get participant');
}

export async function GetAllParticipant(apiClient: AxiosInstance | undefined) {
  if (!apiClient) throw Error('Unauthorized');
  const result = await apiClient.get<Participant[]>(`/users/`);
  if (result.status === 200) {
    return result.data;
  }
  throw Error('Could not load participants');
}
