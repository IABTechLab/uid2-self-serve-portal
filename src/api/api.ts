import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
// import { setupAdminClient } from './kcAdminClient';
import { auth, claimIncludes } from 'express-oauth2-jwt-bearer';

import { Configure } from '../database/SelfServeDatabase';
import { kcAuthConfig } from './kcConfig';
import { userRouter } from './userRouter';

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

router.use('/users', userRouter);

router.get('/:account/test', claimIncludes('roles', 'admin'), async (_req, res) => {
  return res.sendStatus(200);
});

router.all('/*', (req, res) => {
  res.json({ message: `${req.method} not allowed on this route` }).status(405);
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
