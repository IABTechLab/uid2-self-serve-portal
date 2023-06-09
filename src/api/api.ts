import 'express-async-errors';

import bodyParser from 'body-parser';
import cors from 'cors';
import type { ErrorRequestHandler } from 'express';
import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import expressWinston from 'express-winston';
import promClient from 'prom-client';
import { v4 as uuid } from 'uuid';

import { Configure } from '../database/SelfServeDatabase';
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
import { participantsRouter } from './participantsRouter';
import { usersRouter } from './usersRouter';

const BASE_REQUEST_PATH = '/api';

Configure();

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

const app = express();
const router = express.Router();
app.use((req, res, next) => {
  req.headers.traceId = uuid();
  next();
});
app.use(cors()); // TODO: Make this more secure
app.use(bodyParser.json());

const [logger, errorLogger] = getLoggers();

app.use(expressWinston.logger(logger));

app.use(
  makeMetricsApiMiddleware(
    {
      isNormalizePathEnabled: true,
      discardUnmatched: false,
    },
    logger
  )
);

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

const port = 6540;

app.use(async (_req, _res, next) => {
  // TODO: Use a logger
  await next();
});

router.get('/', async (_req, res) => {
  res.json('UID2 Self-serve Portal: Online');
});

router.use('/users', usersRouter);
router.use('/participants', participantsRouter);
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
  res.status(500).json({
    message:
      'Something unexpected went wrong. If the problem persists, please contact support with details about what you were trying to do.',
    errorHash: req.headers.traceId,
  });
};
app.use(errorHandler);

export default app.listen(port, () => {
  logger.info(`Listening on port ${port}.`);
});
