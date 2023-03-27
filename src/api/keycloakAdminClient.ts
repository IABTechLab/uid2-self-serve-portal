import KcAdminClient from '@keycloak/keycloak-admin-client';

import { SSP_KK_AUDIENCE, SSP_KK_AUTH_SERVER_URL, SSP_KK_REALM, SSP_KK_SECRET } from './envars';

const kcAdminClient = new KcAdminClient({
  baseUrl: SSP_KK_AUTH_SERVER_URL,
  realmName: SSP_KK_REALM,
});
export const getKcAdminClient = async () => {
  await kcAdminClient.auth({
    grantType: 'client_credentials',
    clientId: SSP_KK_AUDIENCE,
    clientSecret: SSP_KK_SECRET,
  });
  return kcAdminClient;
};
