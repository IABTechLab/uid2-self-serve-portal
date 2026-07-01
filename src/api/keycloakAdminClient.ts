import KeycloakAdminClient from '@keycloak/keycloak-admin-client';

import { SSP_KK_AUDIENCE, SSP_KK_AUTH_SERVER_URL, SSP_KK_REALM, SSP_KK_SECRET } from './envars';

let KcAdminClientClass: typeof KeycloakAdminClient | null = null;

// dynamic import of KcAdminClient required by keycloak-admin-client version 26.1.3
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

	// Strip any trailing slash: keycloak-admin-client builds the token URL as
	// `${baseUrl}/realms/...`, so a trailing slash yields a non-normalized `//realms/...`
	// path that Keycloak 26.6.3+ rejects with `missingNormalization` (keycloak-js
	// normalizes this for us on the frontend, but the admin client does not).
	const kcClient = new KcAdminClientClass({
    baseUrl: SSP_KK_AUTH_SERVER_URL.replace(/\/+$/, ''),
    realmName: SSP_KK_REALM,
  });

  await kcClient.auth({
    grantType: 'client_credentials',
    clientId: SSP_KK_AUDIENCE,
    clientSecret: SSP_KK_SECRET,
  });

  return kcClient;
};
