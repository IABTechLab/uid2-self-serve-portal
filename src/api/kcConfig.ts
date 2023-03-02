import KcAdminClient from '@keycloak/keycloak-admin-client';

export const kcAuthConfig = {
  audience: 'self_serve_portal_apis',
  issuerBaseURL: 'http://localhost:18080/realms/self-serve-portal',
};

export const setupAdminClient = async () => {
  const kcAdminClient = new KcAdminClient({
    realmName: 'self-serve-portal',
    baseUrl: 'http://localhost:18080',
  });

  // Authorize with username / password
  await kcAdminClient.auth({
    username: 'admin',
    password: 'D3velopmentP0',
    grantType: 'password',
    clientId: 'admin-cli',
  });
  return kcAdminClient;
};
