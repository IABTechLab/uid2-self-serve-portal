import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import KeycloakConnect from 'keycloak-connect';
import { z } from 'zod';

import { Configure } from '../database/SelfServeDatabase';
import { User } from './entities/User';
Configure();

const app = express();
const router = express.Router();
app.use(cors()); // TODO: Make this more secure
app.use(bodyParser.json());
const keycloak = new KeycloakConnect({});

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
  // console.log('Request', req);
  await next();
});

app.use(keycloak.middleware({}));
router.get('/', async (_req, res) => {
  res.json('UID2 Self-serve Portal: Online');
});

const userIdParser = z.object({
  userid: z.string(),
});
router.get('/users/:userid', keycloak.protect(), async (req, res) => {
  const { userid } = userIdParser.parse(req.params);
  const user = await User.query().findById(userid);
  return res.json(user);
});
router.get('/users/', keycloak.protect(), async (_req, res) => {
  if (testDelay) await delay(5000);
  const users = await User.query();
  return res.json(users).send();
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
  if (userResult.length === 1) res.json(userResult);
  else if (userResult.length > 1) {
    return res.status(500).json('Duplicate accounts found, please contact support');
  } else {
    return res.sendStatus(404);
  }
});

router.all('/*', (req, res) => {
  res.json({ status: 405, message: `${req.method} not allowed on this route` });
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
