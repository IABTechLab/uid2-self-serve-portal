/* eslint-disable import/no-extraneous-dependencies */
import 'reflect-metadata';

import { jest } from '@jest/globals';
import { Server } from 'http';
import { createHttpTerminator, HttpTerminator } from 'http-terminator';
import { Request } from 'supertest';

import { TestConfigure } from '../../database/TestSelfServeDatabase';
import type { configureAndStartApi as ConfigureAndStartApi } from '../configureApi';

// Token verification is replaced so the tests do not need a running Keycloak.
const actualJwtBearer = jest.requireActual<object>('express-oauth2-jwt-bearer');
jest.mock('express-oauth2-jwt-bearer', () => ({
  ...actualJwtBearer,
  auth: () => (req: { auth?: unknown }, _res: unknown, next: () => void) => {
    req.auth = {
      payload: {
        email: 'test_user@example.com',
        /* eslint-disable camelcase */
        resource_access: { self_serve_portal_apis: { roles: ['api-participant-member'] } },
        /* eslint-enable camelcase */
      },
    };
    next();
  },
}));

const { configureAndStartApi }: { configureAndStartApi: typeof ConfigureAndStartApi } =
  await import('../configureApi');

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
  afterAll(async () => {
    if (api === null || terminator === null) throw Error('Server was not configured!');
    terminator.terminate();
    api = null;
    terminator = null;
  });
  beforeAll(async () => {
    await TestConfigure();
    const serverDetails = configureAndStartApi(false, 6541);
    api = serverDetails.server;
    routers = serverDetails.routers;
    terminator = createHttpTerminator({ server: api });
  });
  function withToken(apiRequest: Request) {
    return apiRequest.set('Authorization', 'Bearer test-token');
  }
  return withToken;
}
export default useTestServer;
