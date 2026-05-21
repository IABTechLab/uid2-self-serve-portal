import request from 'supertest';
import express from 'express';
import { configRouter } from '../routers/configRouter';

describe('GET /api/config', () => {
  const app = express();
  app.use('/api/config', configRouter);

  afterEach(() => { delete process.env.SSP_PORTAL_IDENTITY; });

  it('returns UID2 config by default', async () => {
    const res = await request(app).get('/api/config').expect(200);
    expect(res.body).toEqual({
      identity: 'UID2',
      productName: 'UID2',
      docsBaseUrl: 'https://unifiedid.com/docs/intro',
      logo: { light: '/uid2-logo.svg', dark: '/uid2-logo-darkmode.svg' },
    });
  });

  it('returns EUID config when identity=EUID', async () => {
    process.env.SSP_PORTAL_IDENTITY = 'EUID';
    const res = await request(app).get('/api/config').expect(200);
    expect(res.body.identity).toBe('EUID');
    expect(res.body.docsBaseUrl).toBe('https://euid.eu/docs/intro');
    expect(res.body.logo.light).toBe('/euid-logo.svg');
  });
});
