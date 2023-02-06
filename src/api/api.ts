import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import logger from 'koa-logger';
import Router from 'koa-router';
import { z } from 'zod';

import { Configure } from '../database/SelfServeDatabase';
import { User } from './entities/User';

Configure();

const app: Koa = new Koa();

const routerOpts: Router.IRouterOptions = {
  prefix: '/api',
};
const router = new Router(routerOpts);

app.use(cors()); // TODO: Make this more secure
app.use(json());
app.use(logger());
app.use(bodyParser());

const port = 6540;
const testDelay = false;

// TODO: Remove - this is just for testing
function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

app.use(async (ctx, next) => {
  // TODO: Use a logger
  console.log('Request', ctx.request);
  await next();
});

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = 'UID2 Self-serve Portal: Online';
});

const userIdParser = z.object({
  userid: z.string(),
});
router.get('/users/:userid', async (ctx) => {
  const { userid } = userIdParser.parse(ctx.params);
  const user = await User.query().findById(userid);
  ctx.body = user;
});
router.get('/users/', async (ctx) => {
  if (testDelay) await delay(5000);
  const users = await User.query();
  ctx.body = users;
});

const loginPostParser = z.object({
  email: z.string(),
});
router.post('/login', async (ctx) => {
  // TODO: This is a test login route only - it's temporary
  const { email } = loginPostParser.parse(ctx.request.body);
  if (!email) {
    ctx.status = 404;
    return;
  }

  const userResult = await User.query().where('email', email);
  if (userResult.length === 1) [ctx.body] = userResult;
  else if (userResult.length > 1) {
    ctx.status = 500;
    ctx.body = 'Duplicate accounts found, please contact support';
  } else ctx.status = 404;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
