import 'express-async-errors';

import bodyParser from 'body-parser';
import cors from 'cors';
import type { ErrorRequestHandler } from 'express';
import express from 'express';
import { auth, claimCheck, JWTPayload } from 'express-oauth2-jwt-bearer';
import expressWinston from 'express-winston';
import promClient from 'prom-client';
import { v4 as uuid } from 'uuid';

import { ParticipantType } from './entities/ParticipantType';
import {
  SSP_KK_AUDIENCE,
  SSP_KK_AUTH_SERVER_URL,
  SSP_KK_ISSUER_BASE_URL,
  SSP_KK_REALM,
  SSP_KK_SSL_CONFIDENTIAL_PORT,
  SSP_KK_SSL_PUBLIC_CLIENT,
  SSP_KK_SSL_REQUIRED,
  SSP_KK_SSL_RESOURCE,
} from './envars';
import { getLoggers } from './helpers/loggingHelpers';
import makeMetricsApiMiddleware from './middleware/metrics';
import { createParticipantsRouter } from './participantsRouter';
import { createUsersRouter } from './usersRouter';

const BASE_REQUEST_PATH = '/api';
function bypassHandlerForPaths(middleware: express.Handler, ...paths: string[]) {
  return function (req, res, next) {
    const pathCheck = paths.some((path) => path === req.path);
    if (pathCheck) {
      next();
    } else {
      middleware(req, res, next);
    }
  } as express.Handler;
}

export function configureAndStartApi(useMetrics: boolean = true) {
  const app = express();
  const routers = {
    rootRouter: express.Router(),
    participantsRouter: createParticipantsRouter(),
    usersRouter: createUsersRouter(),
  };
  const router = routers.rootRouter;
  app.use((req, res, next) => {
    req.headers.traceId = uuid();
    next();
  });
  app.use(cors()); // TODO: Make this more secure
  app.use(bodyParser.json());

  const [logger, errorLogger] = getLoggers();

  app.use(expressWinston.logger(logger));

  if (useMetrics) {
    app.use(
      makeMetricsApiMiddleware(
        {
          isNormalizePathEnabled: true,
          discardUnmatched: false,
        },
        logger
      )
    );
  }

  app.use(
    bypassHandlerForPaths(
      auth({
        audience: SSP_KK_AUDIENCE,
        issuerBaseURL: SSP_KK_ISSUER_BASE_URL,
      }),
      `/favicon.ico`,
      `${BASE_REQUEST_PATH}/`,
      `${BASE_REQUEST_PATH}/metrics`,
      `${BASE_REQUEST_PATH}/health`,
      `${BASE_REQUEST_PATH}/keycloak-config`
    )
  );

  type Claim = JWTPayload & {
    resource_access?: {
      self_serve_portal_apis?: {
        roles?: string[];
      };
    };
  };

  app.use(
    bypassHandlerForPaths(
      claimCheck((claim: Claim) => {
        console.log('In claim check', claim);
        const roles = claim.resource_access?.self_serve_portal_apis?.roles || [];
        return roles.includes('api-participant-member');
      }),
      `/favicon.ico`,
      `${BASE_REQUEST_PATH}/`,
      `${BASE_REQUEST_PATH}/metrics`,
      `${BASE_REQUEST_PATH}/health`,
      `${BASE_REQUEST_PATH}/keycloak-config`,
      `${BASE_REQUEST_PATH}/participantTypes`,
      `${BASE_REQUEST_PATH}/participants`,
      `${BASE_REQUEST_PATH}/users`
    )
  );

  app.use(async (_req, _res, next) => {
    // TODO: Use a logger
    await next();
  });

  router.get('/', async (_req, res) => {
    res.json('UID2 Self-serve Portal: Online');
  });

  router.use('/users', routers.usersRouter);
  router.use('/participants', routers.participantsRouter.router);
  router.get('/health', async (_req, res) => {
    // TODO: More robust health check information
    res.json({ node: process.version });
  });

  router.get('/metrics', async (_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(await promClient.register.metrics());
  });

  router.get('/participantTypes', async (_req, res) => {
    const participantTypes = await ParticipantType.query();
    return res.status(200).json(participantTypes);
  });

  router.get('/keycloak-config', async (_req, res) => {
    // TODO: More robust health check information
    res.json({
      realm: SSP_KK_REALM,
      'auth-server-url': SSP_KK_AUTH_SERVER_URL,
      'ssl-required': SSP_KK_SSL_REQUIRED,
      resource: SSP_KK_SSL_RESOURCE,
      'public-client': SSP_KK_SSL_PUBLIC_CLIENT,
      'confidential-port': SSP_KK_SSL_CONFIDENTIAL_PORT,
    });
  });

  router.all('/*', (req, res) => {
    res.json({ message: `${req.method} not allowed on this route` }).status(405);
  });

  app.use(BASE_REQUEST_PATH, router);

  app.use(expressWinston.errorLogger(errorLogger));
  const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    logger.error(`Fallback error handler invoked: ${err.message}`);
    if (err.statusCode === 401) {
      res.status(401).json({
        message: 'Unauthorized. You do not have the necessary permissions.',
        errorHash: req.headers.traceId,
      });
    } else {
      res.status(500).json({
        message:
          'Something unexpected went wrong. If the problem persists, please contact support with details about what you were trying to do.',
        errorHash: req.headers.traceId,
      });
    }
  };
  app.use(errorHandler);
  const port = 6540;
  const server = app.listen(port, () => {
    logger.info(`Listening on port ${port}.`);
  });
  return { server, routers };
}
