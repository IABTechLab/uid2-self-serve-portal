import axios from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import log from 'loglevel';
import { z } from 'zod';

import { getKeyPairsList } from '../../api/services/adminServiceClient';
import { backendError } from '../utils/apiError';

// export async function GetKeyPairs(): Promise<string> {
//   const a = await getKeyPairs();
//   return a;
//   // try {
//   //   return await getKeyPairs();
//   // } catch (e: unknown) {
//   //   throw backendError(e, 'Could not get key pairs');
//   // }
//   //   try {
//   //     const result = await axios.get<UserWithIsApprover>(`/users/current`, {
//   //       validateStatus: (status) => [200, 404].includes(status),
//   //     });
//   //     if (result.status === 200) return result.data;
//   //     return null;
//   //   } catch (e: unknown) {
//   //     throw backendError(e, 'Could not get user account');
//   //   }
// }

export function GetKeyPairs() {
  return getKeyPairsList();
}
