import { Participant } from '../entities/Participant';
import { CreatedApiKeyDTO } from './adminServiceHelpers';

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

export const validateApiRoles = async (
  keyRoles: string[],
  participant: Participant
): Promise<boolean> => {
  const participantRoles = (await getApiRoles(participant)).map((role) => role.roleName);

  for (const role of keyRoles) {
    if (!participantRoles.includes(role)) return false;
  }

  return true;
};
