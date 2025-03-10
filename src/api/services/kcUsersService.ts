import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';

import { SSP_KK_API_CLIENT_ID, SSP_KK_SSL_RESOURCE, SSP_WEB_BASE_URL } from '../envars';

// dyanmic import of RequiredActionAlias required by keycloak-admin-client version 26.1.3
let RequiredActionAlias: typeof import('@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation').RequiredActionAlias;

async function loadKeycloakRequiredActionAlias() {
  const module = await import(
    '@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation'
  );
  RequiredActionAlias = module.RequiredActionAlias;
}

loadKeycloakRequiredActionAlias()
  .then(() => {})
  .catch(() => {});

export const API_PARTICIPANT_MEMBER_ROLE_NAME = 'api-participant-member';

export const queryUsersByEmail = async (kcAdminClient: KeycloakAdminClient, email: string) => {
  return kcAdminClient.users.find({
    email,
    extract: true,
  });
};

export const doesUserExistInKeycloak = async (
  kcAdminClient: KeycloakAdminClient,
  email: string
) => {
  const existingKcUser = await queryUsersByEmail(kcAdminClient, email);
  return existingKcUser.length > 0;
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

const logoutUrl = new URL('logout', SSP_WEB_BASE_URL).href;
export const sendInviteEmailToNewUser = async (
  kcAdminClient: KeycloakAdminClient,
  user: UserRepresentation
) => {
  await kcAdminClient.users.executeActionsEmail({
    id: user.id!,
    clientId: SSP_KK_SSL_RESOURCE,
    actions: [RequiredActionAlias.UPDATE_PASSWORD],
    redirectUri: logoutUrl,
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

const assignClientRoleToUser = async (
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

export const assignApiParticipantMemberRole = async (
  kcAdminClient: KeycloakAdminClient,
  userEmail: string
) => {
  await assignClientRoleToUser(kcAdminClient, userEmail, API_PARTICIPANT_MEMBER_ROLE_NAME);
};

export const removeApiParticipantMemberRole = async (
  kcAdminClient: KeycloakAdminClient,
  userEmail: string
) => {
  const users = await queryUsersByEmail(kcAdminClient, userEmail);
  if (users.length !== 1) throw Error(`Unable to remove role from ${userEmail}`);

  const apiParticipantMemberRole = await kcAdminClient.clients.findRole({
    id: SSP_KK_API_CLIENT_ID,
    roleName: API_PARTICIPANT_MEMBER_ROLE_NAME,
  });

  if (apiParticipantMemberRole) {
    await kcAdminClient.users.delClientRoleMappings({
      id: users[0].id!,
      clientUniqueId: SSP_KK_API_CLIENT_ID,
      roles: [
        {
          id: apiParticipantMemberRole.id!,
          name: apiParticipantMemberRole.name!,
        },
      ],
    });
  }
};
