import KcAdminClient from '@keycloak/keycloak-admin-client';

export const setupAdminClient = async () => {
  const kcAdminClient = new KcAdminClient({ realmName: 'self-serve-portal' });

  // Authorize with username / password
  await kcAdminClient.auth({
    username: 'admin',
    password: 'D3velopmentP0',
    grantType: 'password',
    clientId: 'admin-cli',
  });
  return kcAdminClient;
};
