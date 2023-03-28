import { RequiredActionAlias } from '@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation';

import { User, UserRole } from '../entities/User';
import { SSP_KK_SSL_RESOURCE, SSP_WEB_BASE_URL } from '../envars';
import { getKcAdminClient } from '../keycloakAdminClient';

export const inviteNewUser = async (
  firstName: string,
  lastName: string,
  email: string,
  jobFunction: UserRole,
  participantId: string
) => {
  const kcAdminClient = await getKcAdminClient();
  const user = await kcAdminClient.users.create({
    firstName,
    lastName,
    email,
    emailVerified: false,
    enabled: true,
  });

  await kcAdminClient.users.executeActionsEmail({
    id: user.id,
    clientId: SSP_KK_SSL_RESOURCE,
    actions: [RequiredActionAlias.UPDATE_PASSWORD],
    redirectUri: SSP_WEB_BASE_URL,
  });
  const userObject = {
    email,
    role: jobFunction,
    participantId,
  };
  return User.query().insert(userObject);
};
