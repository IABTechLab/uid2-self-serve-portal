import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { RequiredActionAlias } from '@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';

import { SSP_KK_API_CLIENT_ID, SSP_KK_SSL_RESOURCE, SSP_WEB_BASE_URL } from '../envars';

export const queryUsersByEmail = async (kcAdminClient: KeycloakAdminClient, email: string) => {
  return kcAdminClient.users.find({
    email,
    extract: true,
  });
};

export const createNewUser = async (
  kcAdminClient: KeycloakAdminClient,
  firstName: string,
  lastName: string,
  email: string
) => {
  const users = await queryUsersByEmail(kcAdminClient, email);
  if (users.length > 0) return users[0];

  return kcAdminClient.users.create({
    firstName,
    lastName,
    email,
    emailVerified: false,
    enabled: true,
  });
};

export const sendInviteEmail = async (
  kcAdminClient: KeycloakAdminClient,
  user: UserRepresentation
) => {
  await kcAdminClient.users.executeActionsEmail({
    id: user.id!,
    clientId: SSP_KK_SSL_RESOURCE,
    actions: [RequiredActionAlias.UPDATE_PASSWORD, RequiredActionAlias.VERIFY_EMAIL],
    redirectUri: SSP_WEB_BASE_URL,
  });
};

type UpdateUserPayload = {
  firstName: string;
  lastName: string;
};

export const updateUserProfile = async (
  kcAdminClient: KeycloakAdminClient,
  userEmail: string,
  updateUserPayload: UpdateUserPayload
) => {
  const users = await queryUsersByEmail(kcAdminClient, userEmail);
  if (users.length !== 1) throw Error(`Unable to update entry for ${userEmail}`);

  await kcAdminClient.users.update(
    {
      id: users[0].id!,
    },
    updateUserPayload
  );
};

export const deleteUserByEmail = async (kcAdminClient: KeycloakAdminClient, userEmail: string) => {
  const userLists = await queryUsersByEmail(kcAdminClient, userEmail);
  const resultLength = userLists.length ?? 0;
  // If user not exists in keycloak, it is fine to just delete the record from db
  if (resultLength < 1) return;
  if (resultLength > 1)
    throw Error(`Multiple results received when loading user entry for ${userEmail}`);

  await kcAdminClient.users.del({
    id: userLists[0].id!,
  });
};

export const assignClientRoleToUser = async (
  kcAdminClient: KeycloakAdminClient,
  userEmail: string,
  roleName: string
) => {
  const users = await queryUsersByEmail(kcAdminClient, userEmail);
  if (users.length !== 1) throw Error(`Unable to assign role to ${userEmail}`);

  const clientRole = await kcAdminClient.clients.findRole({
    id: SSP_KK_API_CLIENT_ID,
    roleName,
  });
  if (!clientRole) throw Error(`Unable to find the client role ${roleName}`);

  await kcAdminClient.users.addClientRoleMappings({
    id: users[0].id!,
    clientUniqueId: SSP_KK_API_CLIENT_ID,
    roles: [
      {
        id: clientRole.id!,
        name: clientRole.name!,
      },
    ],
  });
};
