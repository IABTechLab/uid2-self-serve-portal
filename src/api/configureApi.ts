import 'express-async-errors';
import './controllers/userController';

import { AxiosError } from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { auth, claimCheck, JWTPayload } from 'express-oauth2-jwt-bearer';
import { Container } from 'inversify';
import { getRouteInfo, InversifyExpressServer, TYPE } from 'inversify-express-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as prettyjson from 'prettyjson';
import promClient from 'prom-client';
import { v4 as uuid } from 'uuid';

import TAGS from './constant/tags';
import { TYPES } from './constant/types';
import { ApiRole } from './entities/ApiRole';
import { ParticipantType } from './entities/ParticipantType';
import {
  SSP_IS_DEVELOPMENT,
  SSP_KK_AUDIENCE,
  SSP_KK_AUTH_SERVER_URL,
  SSP_KK_ISSUER_BASE_URL,
  SSP_KK_REALM,
  SSP_KK_SSL_CONFIDENTIAL_PORT,
  SSP_KK_SSL_PUBLIC_CLIENT,
  SSP_KK_SSL_REQUIRED,
  SSP_KK_SSL_RESOURCE,
  SSP_WEB_BASE_URL,
} from './envars';
import {
  getErrorLoggingMiddleware,
  getLoggers,
  getLoggingMiddleware,
  getTraceId,
} from './helpers/loggingHelpers';
import makeMetricsApiMiddleware from './middleware/metrics';
import { createParticipantsRouter } from './routers/participantsRouter';
import { createSitesRouter } from './routers/sitesRouter';
import { createUsersRouter } from './routers/usersRouter';
import { UserService } from './services/userService';

const BASE_REQUEST_PATH = '/api';

type BypassPath = {
  url: string;
  method: string;
};

const BYPASS_PATHS = [
  `/favicon.ico`,
  `${BASE_REQUEST_PATH}/`,
  `${BASE_REQUEST_PATH}/metrics`,
  `${BASE_REQUEST_PATH}/health`,
  `${BASE_REQUEST_PATH}/keycloak-config`,
].map((path) => ({ url: path, method: 'GET' }));

function bypassHandlerForPaths(middleware: express.Handler, ...paths: BypassPath[]) {
  return function (req, res, next) {
    const bypassPath = paths.find((path) => path.url === req.path && path.method === req.method);
    if (bypassPath) {
      next();
    } else {
      middleware(req, res, next);
    }
  } as express.Handler;
}

export function configureAndStartApi(useMetrics: boolean = true) {
  const container = new Container();
  container.bind<UserService>(TYPES.UserService).to(UserService);

  const routers = {
    rootRouter: express.Router(),
    sitesRouter: createSitesRouter(),
  };
  const router = routers.rootRouter;
  const inversifyExpressServer = new InversifyExpressServer(container);
  // const inversifyExpressServer = new InversifyExpressServer(container, router, {
  //   rootPath: '/api',
  // });
  // const inversifyExpressServer = new InversifyExpressServer(container, null, { rootPath: '/api' });

  inversifyExpressServer.setConfig((app) => {
    app.use((req, res, next) => {
      req.headers.traceId = uuid();
      next();
    });
    app.use(cors()); // TODO: Make this more secure
    app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    app.use(bodyParser.json());

    app.use(getLoggingMiddleware());

    const { logger, errorLogger } = getLoggers();
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

    // app.use(
    //   bypassHandlerForPaths(
    //     auth({
    //       audience: SSP_KK_AUDIENCE,
    //       issuerBaseURL: SSP_KK_ISSUER_BASE_URL,
    //     }),
    //     ...BYPASS_PATHS
    //   )
    // );

    type Claim = JWTPayload & {
      resource_access?: {
        self_serve_portal_apis?: {
          roles?: string[];
        };
      };
    };

    // app.use(
    //   bypassHandlerForPaths(
    //     claimCheck((claim: Claim) => {
    //       const roles = claim.resource_access?.self_serve_portal_apis?.roles || [];
    //       return true;
    //       // return roles.includes('api-participant-member');
    //     }),
    //     { url: `${BASE_REQUEST_PATH}/envars`, method: 'GET' },
    //     { url: `${BASE_REQUEST_PATH}/participantTypes`, method: 'GET' },
    //     { url: `${BASE_REQUEST_PATH}/participants`, method: 'POST' },
    //     { url: `${BASE_REQUEST_PATH}/users/current`, method: 'GET' },
    //     { url: `${BASE_REQUEST_PATH}/users/current/participant`, method: 'GET' },
    //     { url: `${BASE_REQUEST_PATH}/users/current/acceptTerms`, method: 'PUT' },
    //     ...BYPASS_PATHS
    //   )
    // );

    app.use(async (_req, _res, next) => {
      // TODO: Use a logger
      await next();
    });

    router.get('/', async (_req, res) => {
      res.json('UID2 Self-serve Portal: Online');
    });

    // Define your routes here directly on the app instance
    // const participantsRouter = createParticipantsRouter();
    // app.use('/participants', participantsRouter);

    // const sitesRouter = createSitesRouter();
    // router.use('/sites', routers.sitesRouter);

    router.get('/health', async (_req, res) => {
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

    router.get('/apiRoles', async (_req, res) => {
      const apiRoles = await ApiRole.query().where('disabled', false);
      return res.status(200).json(apiRoles);
    });

    router.get('/envars', async (_req, res) => {
      const baseUrl = SSP_WEB_BASE_URL;
      const isDevelopment = SSP_IS_DEVELOPMENT;
      return res.json({ baseUrl, isDevelopment });
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
      res.status(404).json({ message: `Route not found.` });
    });

    app.use(BASE_REQUEST_PATH, router); // todo

    app.use(getErrorLoggingMiddleware());
    const errorHandler: express.ErrorRequestHandler = (err, req, res, _next) => {
      const traceId = getTraceId(req);
      errorLogger.error(`Fallback error handler invoked: ${err.message}`, traceId);
      let code = 500;
      if (err instanceof AxiosError) {
        errorLogger.error(`API Error: ${err.response?.data?.message}`, traceId);
        errorLogger.error(err.stack!, traceId);
        code = err.response?.status!;
      } else if (err.stack) {
        errorLogger.error(err.stack as string, traceId);
        if (err.statusCode) {
          code = err.statusCode as number;
        }
      } else {
        errorLogger.error(err as string, traceId);
      }

      if (code === 400) {
        res.status(400).json({
          message: 'Invalid request.',
          errorHash: req.headers.traceId,
        });
      } else if (code === 401) {
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
  });

  const port = 6540;
  const server = inversifyExpressServer.build().listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  const routeInfo = getRouteInfo(container);
  console.log(routeInfo);
  // console.log(prettyjson.render({ routes: routeInfo }));

  return { server, routers };
}
