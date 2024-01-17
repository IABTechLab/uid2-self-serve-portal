import axios from 'axios';

import { ApiRoleDTO } from '../../api/entities/ApiRole';
import { ApiKeySecretsDTO } from '../../api/services/apiKeyService';
import { backendError } from '../utils/apiError';

export async function GetAllEnabledApiRoles() {
  try {
    const result = await axios.get<ApiRoleDTO[]>(`/apiRoles`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get API Roles');
  }
}

export type CreateApiKeyFormDTO = {
  name: string;
  roles: string[];
};

export type EditApiKeyFormDTO = {
  keyId: string;
  newName: string;
  newApiRoles: string[];
};

export async function CreateApiKey(
  form: CreateApiKeyFormDTO,
  participantId?: number
): Promise<ApiKeySecretsDTO> {
  try {
    const result = await axios.post<ApiKeySecretsDTO>(
      `/participants/${participantId ?? 'current'}/apiKey`,
      form
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not create API Key');
  }
}

export async function EditApiKey(form: EditApiKeyFormDTO, participantId?: number) {
  try {
    await axios.put(`/participants/${participantId ?? 'current'}/apiKey`, form);
  } catch (e: unknown) {
    throw backendError(e, 'Could not edit API Key');
  }
}
