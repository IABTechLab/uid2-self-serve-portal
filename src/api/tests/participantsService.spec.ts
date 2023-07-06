import request, { Request } from 'supertest';

import { participantsRouter } from '../participantsRouter';
import { ParticipantRequest } from '../services/participantsService';
import { mockParticipant, mockUser } from './queryMocks';
import useTestServer, { api } from './utils';

describe.only('enrichCurrentParticipant middleware', () => {
  const withToken = useTestServer();

  beforeEach(() => {
    participantsRouter.use((req: ParticipantRequest, res) => {
      res.status(200).json(req.participant);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return 404 if user not found', async () => {
    mockUser([null, null]);
    const req: Request = request(api).get('/api/participants/current/');
    const res = await withToken(req);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual([{ message: 'The user cannot be found.' }]);
  });

  test('should return 404 if participant not found', async () => {
    mockUser();
    mockParticipant(null);
    const req = request(api).get('/api/participants/current/');
    const res = await withToken(req);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual([{ message: 'The participant cannot be found.' }]);
  });

  test('should add participant to request if user and participant are found', async () => {
    mockParticipant();
    mockUser();

    const req = request(api).get('/api/participants/current/');
    const res = await withToken(req);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      id: '1',
      name: 'Test Participant',
      location: 'Test Location',
      allowSharing: true,
    });
  });
});
