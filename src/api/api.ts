import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
// import { setupAdminClient } from './kcAdminClient';
import { auth, claimIncludes } from 'express-oauth2-jwt-bearer';
import { z } from 'zod';

import { Configure } from '../database/SelfServeDatabase';
import { User } from './entities/User';
import { kcAuthConfig } from './kcConfig';

Configure();

const app = express();
const router = express.Router();
app.use(cors()); // TODO: Make this more secure
app.use(bodyParser.json());
app.use(auth(kcAuthConfig));

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
  // const kcAdminClient = await setupAdminClient();

  // // Test adminClient
  // const users = await kcAdminClient.users.find();
  // console.log(users);
  res.json('UID2 Self-serve Portal: Online');
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

app.use('/api', router);

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
