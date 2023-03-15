import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { auth, claimIncludes } from 'express-oauth2-jwt-bearer';

import { Configure } from '../database/SelfServeDatabase';
import { ParticipantType } from './entities/ParticipantType';
import { kcAuthConfig } from './kcConfig';
import { participantsRouter } from './participantsRouter';
import { usersRouter } from './usersRouter';

Configure();

const app = express();
const router = express.Router();
app.use(cors()); // TODO: Make this more secure
app.use(bodyParser.json());
app.use(auth(kcAuthConfig));

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

app.use('/api', router);

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
