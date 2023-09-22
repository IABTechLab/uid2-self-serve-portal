import axios from 'axios';

import { KeyPairDTO, SharingListResponse } from '../../api/services/adminServiceHelpers';
import { mapKeyPairDTOToModel } from '../components/KeyPairs/KeyPairModel';
import { backendError } from '../utils/apiError';

export type AddKeyPairFormProps = {
  participantId: number;
  // siteId: number;
  name?: string;
  disabled: boolean;
};

export async function GetKeyPairs(siteId: number) {
  try {
    const result = await axios.get<KeyPairDTO[]>(`/sites/${siteId}/keypairs`);
    if (result.status === 200) {
      return (result.data as KeyPairDTO[]).map(mapKeyPairDTOToModel);
    }
  } catch (e: unknown) {
    throw backendError(e, 'Could not get key pairs');
  }
}

export async function AddKeyPair(props: AddKeyPairFormProps) {
  try {
    const { participantId } = props;
    const result = await axios.post(`/participants/${participantId}/keyPair/add`, props);
    return result;
  } catch (e: unknown) {
    throw backendError(e, 'Could not add Key Pair');
  }
}
