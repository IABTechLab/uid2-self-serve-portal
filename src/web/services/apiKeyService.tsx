import axios from 'axios';

import { ApiRoleDTO } from '../../api/entities/ApiRole';
import { ApiKeySecretsDTO } from '../../api/services/apiKeyService';
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
): Promise<ApiKeySecretsDTO> {
  try {
    const result = await axios.post<ApiKeySecretsDTO>(
      `/participants/${participantId ?? 'current'}/apiKeys/create`,
      form
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, "Couldn't create API Key");
  }
}
