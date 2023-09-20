import axios from 'axios';

import { KeyPairDTO } from '../../api/services/adminServiceHelpers';
import { mapKeyPairDTOToModel } from '../components/KeyPairs/KeyPairModel';
import { backendError } from '../utils/apiError';

export type AddKeyPairFormProps = {
  siteId: number;
  disabled: boolean;
};

export async function GetKeyPairs() {
  try {
    const result = await axios.get<KeyPairDTO[]>(`/keypairs/list`);
    if (result.status === 200) {
      return (result.data as KeyPairDTO[]).map(mapKeyPairDTOToModel);
    }
  } catch (e: unknown) {
    throw backendError(e, 'Could not get key pairs');
  }
}
