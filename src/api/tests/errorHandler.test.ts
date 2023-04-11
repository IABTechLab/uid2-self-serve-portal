/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import request, { Request } from 'supertest';

import api from '../api';
import { ParticipantType } from '../entities/ParticipantType';
import useTestServer from './utils';

describe('Errors from endpoints do not crash the api', () => {
  const withToken = useTestServer();

  test('responds with 500 when api endpoints throws error', async () => {
    jest.spyOn(ParticipantType, 'query').mockRejectedValueOnce(new Error('Mock Error'));
    const req: Request = request(api).get('/api/participantTypes');
    const res = await withToken(req);
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe(
      'Something unexpected went wrong. If the problem persists, please contact support with details about what you were trying to do.'
    );
  });

  test('responds with 200 when api endpoints execute without errors', async () => {
    const req: Request = request(api).get('/api/participantTypes');
    const res = await withToken(req);
    expect(res.statusCode).toBe(200);
  });
});
