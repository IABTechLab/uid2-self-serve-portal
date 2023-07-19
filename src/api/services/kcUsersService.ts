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

export const deleteUser = async (kcAdminClient: KeycloakAdminClient, user: UserRepresentation) => {
  await kcAdminClient.users.del({
    id: user.id!,
  });
};

export interface KcUserRequest extends UserRequest {
  kcUser?: UserRepresentation;
  kcAdminClient?: KeycloakAdminClient;
}

export const enrichKeycloakUser = async (req: KcUserRequest, res: Response, next: NextFunction) => {
  const kcAdminClient = await getKcAdminClient();
  const keycloakUser = await queryUsersByEmail(kcAdminClient, req.user?.email || '');

  const resultLength = keycloakUser?.length ?? 0;
  if (resultLength < 1) {
    return res.status(404).send([{ message: 'The user cannot be found in keycloak.' }]);
  }
  if (resultLength > 1) {
    return res
      .status(500)
      .send([
        { message: ` Multiple results received when loading user entry for ${req.user?.email}` },
      ]);
  }
  const [kcUser] = keycloakUser;
  req.kcUser = kcUser;
  req.kcAdminClient = kcAdminClient;
  return next();
};
