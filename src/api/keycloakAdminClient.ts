import { SSP_KK_AUDIENCE, SSP_KK_AUTH_SERVER_URL, SSP_KK_REALM, SSP_KK_SECRET } from './envars';

let KcAdminClient;

const loadKcAdminClient = async () => {
  // Dynamically import the Keycloak admin client (ES Module)
  KcAdminClient = (await import('@keycloak/keycloak-admin-client')).default;

  const kcAdminClient = new KcAdminClient({
    baseUrl: SSP_KK_AUTH_SERVER_URL,
    realmName: SSP_KK_REALM,
  });

  return kcAdminClient;
};

export const getKcAdminClient = async () => {
  const kcAdminClient = await loadKcAdminClient();
  await kcAdminClient.auth({
    grantType: 'client_credentials',
    clientId: SSP_KK_AUDIENCE,
    clientSecret: SSP_KK_SECRET,
  });
  return kcAdminClient;
};
