import axios from 'axios';

import { KeyPairDTO } from '../../api/services/adminServiceHelpers';
import { backendError } from '../utils/apiError';

export type KeyPairResponse = KeyPairDTO[];

export async function GetKeyPairs() {
  try {
    const result = await axios.get<KeyPairDTO>(`/keypairs/list`);
    if (result.status === 200) {
      return result.data;
    }
  } catch (e: unknown) {
    throw backendError(e, 'Could not get key pairs');
  }
}
