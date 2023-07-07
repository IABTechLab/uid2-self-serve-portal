import request, { Request } from 'supertest';

import { participantsRouter } from '../participantsRouter';
import { ParticipantRequest } from '../services/participantsService';
import { mockParticipant, mockUser } from './queryMocks';
import useTestServer, { api } from './utils';

describe('Participant Service Tests', () => {
  const withToken = useTestServer();

  beforeAll(() => {
    participantsRouter.get('/:participantId/', (req: ParticipantRequest, res) => {
      res.status(200).json(req.participant);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('hasParticipantAccess middleware', () => {
    it('should allow access to an authenticated user with permission', async () => {
      mockParticipant();
      mockUser();
      const req: Request = request(api).get('/api/participants/1/');
      const res = await withToken(req);

      expect(res.statusCode).not.toBe(403);
    });

    it('should deny access to an authenticated user without permission', async () => {
      mockParticipant();
      mockUser(null);
      const req: Request = request(api).get('/api/participants/1/');
      const res = await withToken(req);

      expect(res.statusCode).toBe(403);
      expect(res.body[0].message).toBe('You do not have permission to that participant.');
    });

    it('should throw error when participant not exists', async () => {
      mockParticipant(null);
      mockUser();
      const req: Request = request(api).get('/api/participants/10000/');
      const res = await withToken(req);

      expect(res.statusCode).toBe(404);
      expect(res.body[0].message).toBe('The participant cannot be found.');
    });
  });

  describe('enrichCurrentParticipant middleware', () => {
    test('should return 404 if user not found', async () => {
      mockUser(null);
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
});
