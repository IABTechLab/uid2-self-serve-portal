import axios from 'axios';

import { KeyPairDTO } from '../../api/services/adminServiceHelpers';
import { mapKeyPairDTOToModel } from '../components/KeyPairs/KeyPairModel';
import { backendError } from '../utils/apiError';

export type AddKeyPairFormProps = {
  participantId?: number;
  name?: string;
  disabled: boolean;
};

export async function GetKeyPairs(participantId?: number) {
  try {
    const result = await axios.get<KeyPairDTO[]>(
      `/participants/${participantId ?? 'current'}/keyPairs`
    );
    if (result.status === 200) {
      return (result.data as KeyPairDTO[]).map(mapKeyPairDTOToModel);
    }
  } catch (e: unknown) {
    throw backendError(e, 'Could not get key pairs');
  }
}

export async function AddKeyPair(props: AddKeyPairFormProps) {
  // try {
  const { participantId } = props;
  const result = await axios.post(`/participants/${participantId ?? 'current'}/keyPair/add`, props);
  return result;
  // } catch (e: unknown) {
  //  throw backendError(e, 'Could not add Key Pair');
  // }
}
