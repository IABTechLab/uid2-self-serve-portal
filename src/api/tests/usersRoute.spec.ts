import request, { Request } from 'supertest';

import api from '../api';
import { Participant } from '../entities/Participant';
import { sendInviteEmail } from '../services/kcUsersService';
import { mockParticipant, mockUser } from './queryMocks';
import useTestServer from './utils';

jest.mock('../keycloakAdminClient', () => ({
  getKcAdminClient: jest.fn(() => ({})),
}));
jest.mock('../services/kcUsersService', () => ({
  queryUsersByEmail: jest.fn(() => [{}]),
  sendInviteEmail: jest.fn(),
}));

describe('Users API tests', () => {
  const withToken = useTestServer();

  describe('When a user re-invites another user', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('From the same participant, the invitation is sent', async () => {
      mockParticipant();
      mockUser([{}, { participantId: 2 }]);
      const req: Request = request(api).post('/api/users/1/resendInvitation');
      const res = await withToken(req);

      expect(res.statusCode).toBe(200);
      expect(sendInviteEmail).toHaveBeenCalled();
    });

    it('should deny access to an authenticated user without permission', async () => {
      mockParticipant();
      mockUser({ participantId: 2 });
      const req: Request = request(api).post('/api/users/1/resendInvitation');
      const res = await withToken(req);

      expect(res.statusCode).toBe(403);
      expect(sendInviteEmail).not.toHaveBeenCalled();
    });
  });
});
