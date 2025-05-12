import { ApiRoleDTO } from '../entities/ApiRole';
import { Participant } from '../entities/Participant';
import { TraceId } from '../helpers/loggingHelpers';
import { getApiKeyById } from './adminServiceClient';
import { ApiKeyDTO, CreatedApiKeyDTO, mapAdminApiKeysToApiKeyDTOs } from './adminServiceHelpers';

export type ApiKeySecretsDTO = {
  plaintextKey: string;
  secret: string;
  name: string;
};

export const createdApiKeyToApiKeySecrets = (apiKey: CreatedApiKeyDTO): ApiKeySecretsDTO => {
  return {
    plaintextKey: apiKey.plaintext_key,
    secret: apiKey.authorizable.secret,
    name: apiKey.authorizable.name,
  };
};

export const getApiRoles = async (participant: Participant) => {
  const participantWithApiRoles = await Participant.query()
    .findById(participant.id)
    .withGraphFetched('apiRoles');

  return participantWithApiRoles?.apiRoles ?? [];
};

export const validateApiRoles = (keyRoles: string[], allowedRoles: ApiRoleDTO[]): boolean => {
  const participantRoles = allowedRoles.map((role) => role.roleName);

  for (const role of keyRoles) {
    if (!participantRoles.includes(role)) return false;
  }

  return true;
};

export const getApiKey = async (
  siteId: number,
  keyId: string,
  traceId: TraceId
): Promise<ApiKeyDTO | undefined> => {
  const apiKeyAdmin = await getApiKeyById(keyId, traceId);

  const isApiKeyAssociatedWithSite = apiKeyAdmin?.site_id === siteId;
  if (!isApiKeyAssociatedWithSite) return undefined;

  return (await mapAdminApiKeysToApiKeyDTOs([apiKeyAdmin]))[0];
};
