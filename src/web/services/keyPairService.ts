import axios from 'axios';

import { KeyPairDTO } from '../../api/services/adminServiceHelpers';
import { KeyPairModel, mapKeyPairDTOToModel } from '../components/KeyPairs/KeyPairModel';
import { backendError } from '../utils/apiError';

export type AddKeyPairFormProps = {
  name?: string;
};

export type UpdateKeyPairFormProps = {
  name?: string;
  subscriptionId: string;
  disabled: boolean;
};

export async function GetKeyPairs(participantId: number) {
  try {
    const result = await axios.get<KeyPairDTO[]>(`/participants/${participantId}/keyPairs`);

    return result.data.map(mapKeyPairDTOToModel);
  } catch (e: unknown) {
    throw backendError(e, 'Could not get key pairs');
  }
}

export async function AddKeyPair(props: AddKeyPairFormProps, participantId: number) {
  const result = await axios.post(`/participants/${participantId}/keyPair/add`, props);
  return result;
}

export async function UpdateKeyPair(props: UpdateKeyPairFormProps, participantId: number) {
  const result = await axios.post(`/participants/${participantId}/keyPair/update`, props);
  return result;
}

export async function DisableKeyPair(keyPair: KeyPairModel, participantId: number) {
  await axios.delete(`/participants/${participantId}/keyPair`, {
    data: { keyPair },
  });
}
