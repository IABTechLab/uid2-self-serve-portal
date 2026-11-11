/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { AddressInfo } from 'net';
import request from 'supertest';

import useTestServer, { api, metricsServer } from './utils';

describe('API traffic is exposed on the metrics server', () => {
  const withToken = useTestServer(true);

  test('requests to the API appear on the metrics listener but not on the API port', async () => {
    const apiResponse = await withToken(request(api).get('/api/participantTypes'));
    expect(apiResponse.statusCode).toBe(200);

    const metricsPort = (metricsServer!.address() as AddressInfo).port;
    const metricsResponse = await request(`http://127.0.0.1:${metricsPort}`).get('/metrics');

    expect(metricsResponse.statusCode).toBe(200);
    expect(metricsResponse.text).toMatch(
      /http_request_duration_seconds_count\{[^}]*status_code="200"[^}]*path="\/api\/participantTypes"[^}]*\} 1/
    );

    const publicResponse = await withToken(request(api).get('/api/metrics'));
    expect(publicResponse.statusCode).toBe(404);
  });
});
