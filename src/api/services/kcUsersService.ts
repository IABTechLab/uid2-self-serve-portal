import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { RequiredActionAlias } from '@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { NextFunction, Response } from 'express';

import { SSP_KK_SSL_RESOURCE, SSP_WEB_BASE_URL } from '../envars';
import { getKcAdminClient } from '../keycloakAdminClient';
import { UserRequest } from './usersService';

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
