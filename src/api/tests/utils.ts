/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import 'reflect-metadata';

import { Server } from 'http';
import { createHttpTerminator, HttpTerminator } from 'http-terminator';
import tokenRequester from 'keycloak-request-token';
import { Request } from 'supertest';

import { configureAndStartApi } from '../configureApi';

/**
 * WARN: This leaves open time_wait connections after the test suite has finished running.
 * This is linked to the issue described [here](https://github.com/request/request/issues/287)
 * As a work-around, we currently run the 'test-api' script with a '--forceExit' flag.
 *
 * @returns withToken: A utility function that adds auth token to the request.
 */
// eslint-disable-next-line import/no-mutable-exports
export let api: Server | null = null;
// eslint-disable-next-line import/no-mutable-exports
export let routers: ReturnType<typeof configureAndStartApi>['routers'] | null = null;
let terminator: HttpTerminator | null = null;

function useTestServer() {
  let token = '';

  beforeAll(async () => {
    const serverDetails = configureAndStartApi(false, 6541);
    api = serverDetails.server;
    routers = serverDetails.routers;
    terminator = createHttpTerminator({ server: api });

    token = await tokenRequester(process.env.SSP_KK_AUTH_SERVER_URL!, {
      username: 'test_user@example.com',
      password: 'test12345',
      grant_type: 'password', // eslint-disable-line camelcase
      client_id: 'self_serve_portal_web', // eslint-disable-line camelcase
      realmName: 'self-serve-portal',
    });
  });

  afterAll(async () => {
    if (!api || !terminator) throw new Error('Server was not configured!');
    await terminator.terminate();
    api = null;
    terminator = null;
  });

  function withToken(apiRequest: Request) {
    return apiRequest.set('Authorization', `Bearer ${token}`);
  }

  return withToken;
}

export default useTestServer;
