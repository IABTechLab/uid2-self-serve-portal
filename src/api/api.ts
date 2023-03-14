import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { auth, claimIncludes } from 'express-oauth2-jwt-bearer';
import { z } from 'zod';

import { Configure } from '../database/SelfServeDatabase';
import { User } from './entities/User';
import { kcAuthConfig } from './kcConfig';

const BASE_REQUEST_PATH = '/api';

Configure();

function bypassHandlerForPaths(middleware:express.Handler, ...paths:string[]) {
    return function(req, res, next) {
      const pathCheck = paths.some(path => path === req.path);
      if (pathCheck) {
        next();
      } else {
        middleware(req, res, next);
      }
    } as express.Handler;
};

const app = express();
const router = express.Router();
app.use(cors()); // TODO: Make this more secure
app.use(bodyParser.json());
app.use(bypassHandlerForPaths(auth(kcAuthConfig), `${BASE_REQUEST_PATH}/`, `${BASE_REQUEST_PATH}/health`));

const port = 6540;
const testDelay = false;

// TODO: Remove - this is just for testing
function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

app.use(async (_req, _res, next) => {
  // TODO: Use a logger
  await next();
});

router.get('/', async (_req, res) => {
  res.json('UID2 Self-serve Portal: Online');
});

router.get('/health', async (_req, res) => {
  // TODO: More robust health check information
  res.json({ node: process.version });
});

const userIdParser = z.object({
  userid: z.string(),
});
router.get('/users/:userid', async (req, res) => {
  const { userid } = userIdParser.parse(req.params);
  const user = await User.query().findById(userid);
  return res.status(200).json(user);
});

router.get('/users/', async (_req, res) => {
  if (testDelay) await delay(5000);
  const users = await User.query();
  return res.status(200).json(users);
});

router.get('/:account/test', claimIncludes('roles', 'admin'), async (_req, res) => {
  return res.sendStatus(200);
});

const loginPostParser = z.object({
  email: z.string(),
});
router.post('/login', async (req, res) => {
  // TODO: This is a test login route only - it's temporary
  const { email } = loginPostParser.parse(req.body);
  if (!email) {
    return res.sendStatus(404);
  }

  const userResult = await User.query().where('email', email);
  if (userResult.length === 1) return res.json(userResult);
  if (userResult.length > 1) {
    return res.status(500).json('Duplicate accounts found, please contact support');
  }
  return res.sendStatus(404);
});

router.all('/*', (req, res) => {
  res.json({ status: 405, message: `${req.method} not allowed on this route` });
});

app.use(BASE_REQUEST_PATH, router);

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
