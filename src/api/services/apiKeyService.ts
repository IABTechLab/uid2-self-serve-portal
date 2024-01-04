import { Participant } from '../entities/Participant';
import { CreatedApiKeyDTO } from './adminServiceHelpers';

export type ApiKeySecretsDTO = {
  plaintextKey: string;
  secret: string;
  name: string;
};

export const createdApiKeyToApiKeySecret = (apiKey: CreatedApiKeyDTO): ApiKeySecretsDTO => {
  // eslint-disable-next-line camelcase
  return {
    plaintextKey: apiKey.plaintext_key,
    secret: apiKey.authorizable.secret,
    name: apiKey.authorizable.name,
  };
};

export const getApiRoles = async (participant: Participant) => {
  const participantCurr = await Participant.query()
    .findById(participant.id)
    .withGraphFetched('apiRoles');

  if (!participantCurr?.apiRoles) {
    return [];
  }
  return participantCurr.apiRoles;
};

export const allowedApiRoles = async (
  keyRoles: string[],
  participant: Participant
): Promise<boolean> => {
  const userRoles = (await getApiRoles(participant)).map((role) => role.roleName);

  for (const role of keyRoles) {
    if (!userRoles.includes(role)) return false;
  }

  return true;
};
