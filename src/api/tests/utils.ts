/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import tokenRequester from 'keycloak-request-token';
import { Request } from 'supertest';

import api from '../api';

function useTestServer() {
  let token = '';
  afterAll(async () => {
    api.close();
  });
  beforeAll(async () => {
    token = await tokenRequester(process.env.SSP_KK_AUTH_SERVER_URL, {
      username: 'kshitij.banerjee@thetradedesk.com', // TODO: add test user for development
      password: '123456',
      grant_type: 'password', // eslint-disable-line camelcase
      client_id: 'self_serve_portal_web', // eslint-disable-line camelcase
      realmName: 'self-serve-portal',
    });
  });
  function withToken(apiRequest: Request) {
    return apiRequest.set('Authorization', `Bearer ${token}`);
  }
  return withToken;
}
export default useTestServer;
