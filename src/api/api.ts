import 'express-async-errors';

import bodyParser from 'body-parser';
import cors from 'cors';
import type { ErrorRequestHandler } from 'express';
import express from 'express';
import { auth, claimIncludes } from 'express-oauth2-jwt-bearer';
import { collectDefaultMetrics, Registry } from 'prom-client';
import { v4 as uuid } from 'uuid';

import { Configure } from '../database/SelfServeDatabase';
import { ParticipantType } from './entities/ParticipantType';
import {
  SSP_APP_NAME,
  SSP_KK_AUDIENCE,
  SSP_KK_AUTH_SERVER_URL,
  SSP_KK_ISSUER_BASE_URL,
  SSP_KK_REALM,
  SSP_KK_SSL_CONFIDENTIAL_PORT,
  SSP_KK_SSL_PUBLIC_CLIENT,
  SSP_KK_SSL_REQUIRED,
  SSP_KK_SSL_RESOURCE,
} from './envars';
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

const register = new Registry();

register.setDefaultLabels({
  app: `${SSP_APP_NAME}`,
});

collectDefaultMetrics({ register });

const app = express();
const router = express.Router();
app.use(cors()); // TODO: Make this more secure
app.use(bodyParser.json());

app.use(
  bypassHandlerForPaths(
    auth({
      audience: SSP_KK_AUDIENCE,
      issuerBaseURL: SSP_KK_ISSUER_BASE_URL,
    }),
    `/favicon.ico`,
    `${BASE_REQUEST_PATH}/`,
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
  res.setHeader('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.end(metrics);
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

router.get('/:account/test', claimIncludes('roles', 'admin'), async (_req, res) => {
  return res.sendStatus(200);
});

router.all('/*', (req, res) => {
  res.json({ message: `${req.method} not allowed on this route` }).status(405);
});

app.use(BASE_REQUEST_PATH, router);

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.log('Fallback error handler invoked:');
  console.log(err.message);
  res.status(500).json({
    message:
      'Something unexpected went wrong. If the problem persists, please contact support with details about what you were trying to do.',
    errorHash: uuid(), // TODO: should come from winston request context
  });
};
app.use(errorHandler);

export default app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
