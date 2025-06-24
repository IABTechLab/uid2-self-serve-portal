import { SSP_KK_AUDIENCE, SSP_KK_AUTH_SERVER_URL, SSP_KK_REALM, SSP_KK_SECRET } from './envars.ts';

// dynamic import of KcAdminClient required by keycloak-admin-client version 26.1.3
let KcAdminClient;

const loadKcAdminClient = async () => {
  KcAdminClient = (await import('@keycloak/keycloak-admin-client')).default;
	console.log('KEYCLOAK ADMIN CLIENT MODULEEEEEEEEE');
	const m = await import('@keycloak/keycloak-admin-client');
	console.log(m);

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
