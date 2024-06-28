import request, { Request } from 'supertest';

import { sendInviteEmail } from '../services/kcUsersService';
import { mockParticipant, mockUser, mockUserOnce, mockUserWithNoParticipant } from './queryMocks';
import useTestServer, { api } from './utils';

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
      jest.clearAllMocks();
    });

    test('From the same participant, the invitation is sent', async () => {
      mockParticipant();
      mockUser([{}, {}]);
      const req: Request = request(api).post('/api/users/1/resendInvitation');
      const res = await withToken(req);

      expect(res.statusCode).toBe(200);
      expect(sendInviteEmail).toHaveBeenCalled();
    });
  });
});
