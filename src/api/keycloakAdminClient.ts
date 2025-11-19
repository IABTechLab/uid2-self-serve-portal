import KeycloakAdminClient from '@keycloak/keycloak-admin-client';

import { SSP_KK_AUDIENCE, SSP_KK_AUTH_SERVER_URL, SSP_KK_REALM, SSP_KK_SECRET } from './envars';

let KcAdminClientClass: typeof KeycloakAdminClient | null = null;

// dynamic import of KcAdminClient required by keycloak-admin-client version 26.4.5
const loadKcAdminClient = async () => {
	KcAdminClientClass ??= (await import('@keycloak/keycloak-admin-client')).default;
};

export const getKcAdminClient = async () => {
	if (!KcAdminClientClass) {
		await loadKcAdminClient();
		if (!KcAdminClientClass) {
			throw new Error('Failed to load Keycloak Admin Client class');
		}
  }

	const kcClient = new KcAdminClientClass({
    baseUrl: SSP_KK_AUTH_SERVER_URL,
    realmName: SSP_KK_REALM,
  });

  await kcClient.auth({
    grantType: 'client_credentials',
    clientId: SSP_KK_AUDIENCE,
    clientSecret: SSP_KK_SECRET,
  });

  return kcClient;
};
