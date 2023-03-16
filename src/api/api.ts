import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { auth, claimIncludes } from 'express-oauth2-jwt-bearer';

import { Configure } from '../database/SelfServeDatabase';
import { ParticipantType } from './entities/ParticipantType';
import { kcAuthConfig } from './kcConfig';
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
app.use(cors()); // TODO: Make this more secure
app.use(bodyParser.json());
app.use(
  bypassHandlerForPaths(auth(kcAuthConfig), `${BASE_REQUEST_PATH}/`, `${BASE_REQUEST_PATH}/health`)
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

router.get('/participantTypes', async (_req, res) => {
  const participantTypes = await ParticipantType.query();
  return res.status(200).json(participantTypes);
});
router.get('/:account/test', claimIncludes('roles', 'admin'), async (_req, res) => {
  return res.sendStatus(200);
});

router.all('/*', (req, res) => {
  res.json({ message: `${req.method} not allowed on this route` }).status(405);
});

app.use(BASE_REQUEST_PATH, router);

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
