import { SSP_KK_AUDIENCE, SSP_KK_AUTH_SERVER_URL, SSP_KK_REALM, SSP_KK_SECRET } from './envars';

// dynamic import of KcAdminClient required by keycloak-admin-client version 26.1.3
const loadKcAdminClient = async () => {
  const KcAdminClientClass = (await import('@keycloak/keycloak-admin-client')).default;

  return new KcAdminClientClass({
    baseUrl: SSP_KK_AUTH_SERVER_URL,
    realmName: SSP_KK_REALM,
  });
};

export const getKcAdminClient = async () => {
  const kcClient = await loadKcAdminClient();
  await kcClient.auth({
    grantType: 'client_credentials',
    clientId: SSP_KK_AUDIENCE,
    clientSecret: SSP_KK_SECRET,
  });
	
  return kcClient;
};
