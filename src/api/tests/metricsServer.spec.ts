import { jest } from '@jest/globals';
import { Server } from 'http';
import { AddressInfo } from 'net';
import promClient from 'prom-client';
import request from 'supertest';
import { Logger } from 'winston';

import { startMetricsServer } from '../metricsServer';

describe('metrics server', () => {
  let server: Server;
  let port: number;

  beforeAll(async () => {
    promClient.register.clear();
    new promClient.Counter({ name: 'metrics_server_test_total', help: 'Test counter' }).inc();

    const logger = { info: jest.fn() } as unknown as Logger;
    // Port 0 lets the OS pick a free port so the test does not collide with a running API.
    server = startMetricsServer(logger, 0);
    await new Promise((resolve) => {
      server.once('listening', resolve);
    });
    port = (server.address() as AddressInfo).port;
  });

  afterAll(async () => {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  it('serves the prometheus registry on /metrics', async () => {
    const response = await request(`http://127.0.0.1:${port}`).get('/metrics');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
    expect(response.text).toContain('metrics_server_test_total 1');
  });

  it('does not serve the API under the metrics listener', async () => {
    const response = await request(`http://127.0.0.1:${port}`).get('/api/metrics');

    expect(response.status).toBe(404);
  });
});
