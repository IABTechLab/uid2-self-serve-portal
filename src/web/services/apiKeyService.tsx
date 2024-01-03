import axios from 'axios';
import { error } from 'console';

import { ApiRoleDTO } from '../../api/entities/ApiRole';
import { ApiKeySecretDTO } from '../../api/services/apiKeyService';
import { backendError } from '../utils/apiError';

export async function GetAllApiRoles() {
  try {
    const result = await axios.get<ApiRoleDTO[]>(`/apiRoles`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get API Roles');
  }
}

export type ApiKeyCreationFormDTO = {
  name: string;
  roles: string[];
};

export async function CreateApiKey(
  form: ApiKeyCreationFormDTO,
  participantId?: number
): Promise<ApiKeySecretDTO> {
  try {
    const result = await axios.post<ApiKeySecretDTO>(
      `/participants/${participantId ?? 'current'}/apiKeys/create`,
      form
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could create API Key');
  }
}
