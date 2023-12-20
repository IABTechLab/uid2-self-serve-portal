import axios from 'axios';

import { ApiRoleDTO } from '../../api/entities/ApiRole';
import { backendError } from '../utils/apiError';

export async function GetAllApiRoles() {
  try {
    const result = await axios.get<ApiRoleDTO[]>(`/apiRoles`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get apiRoles');
  }
}
