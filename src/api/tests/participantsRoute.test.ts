import { QueryBuilder } from 'objection';
import request, { Request } from 'supertest';

import { app } from '../api';
import { Participant } from '../entities/Participant';
import { User } from '../entities/User';
import useTestServer from './utils';

const mockParticipant = (participant?: Participant | null) => {
  jest.spyOn(Participant, 'query').mockReturnValueOnce(
    QueryBuilder.forClass(Participant).resolve(
      participant === undefined
        ? {
            id: '1',
            name: 'Test Participant',
            location: 'Test Location',
            allowSharing: true,
          }
        : participant
    )
  );
};

const mockUser = (user?: User | null) => {
  jest.spyOn(User, 'query').mockReturnValueOnce(
    QueryBuilder.forClass(User).resolve(
      user === undefined
        ? {
            id: '1',
            email: 'test_user@example.com',
            name: 'Test User',
            participantId: 1,
          }
        : user
    )
  );
};
describe('Participants Route tests', () => {
  const withToken = useTestServer();

  describe('hasParticipantAccess middleware', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should allow access to an authenticated user with permission', async () => {
      mockParticipant();
      mockUser();
      const req: Request = request(app).post('/api/participants/1/invite');
      const res = await withToken(req);

      expect(Participant.query).toHaveBeenCalledTimes(1);
      expect(User.query).toHaveBeenCalledTimes(1);

      expect(res.statusCode).toBe(400);
    });

    it('should deny access to an authenticated user without permission', async () => {
      mockParticipant();
      mockUser(null);
      const req: Request = request(app).post('/api/participants/1/invite');
      const res = await withToken(req);

      expect(Participant.query).toHaveBeenCalledTimes(1);
      expect(User.query).toHaveBeenCalledTimes(1);

      expect(res.statusCode).toBe(401);
      expect(res.body[0].message).toBe('You do not have permission to update participant.');
    });

    it('should throw error when participant not exists', async () => {
      mockParticipant(null);
      mockUser();
      const req: Request = request(app).post('/api/participants/10000/invite');
      const res = await withToken(req);

      expect(Participant.query).toHaveBeenCalledTimes(1);
      expect(User.query).toHaveBeenCalledTimes(0);

      expect(res.statusCode).toBe(404);
      expect(res.body[0].message).toBe('The participant cannot be found.');
    });
  });
});
