import request, { Request } from 'supertest';

import { isApproverCheck } from '../middleware/approversMiddleware';
import { ParticipantRequest } from '../services/participantsService';
import { mockApprover, mockParticipant, mockUser } from './queryMocks';
import useTestServer, { api, routers } from './utils';

describe('Approvers Service Tests', () => {
  const withToken = useTestServer();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeAll(() => {
    routers!.participantsRouter.router.get(
      '/:participantId/testApprover',
      isApproverCheck,
      (_req: ParticipantRequest, res) => {
        res.sendStatus(200);
      }
    );
  });

  describe('isApproverCheck middleware', () => {
    it('should allow access when current user is approver', async () => {
      mockUser();
      mockApprover();
      const req: Request = request(api).get('/api/participants/awaitingApproval');
      const res = await withToken(req);

      expect(res.statusCode).toBe(200);
    });

    it('should deny access when current user is not approver', async () => {
      mockUser({
        email: 'test@newuser.com',
      });
      mockApprover(null);

      const req: Request = request(api).get('/api/participants/awaitingApproval');
      const res = await withToken(req);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('Unauthorized. You do not have the necessary permissions.');
    });

    it('should deny access when current user is not approver of the current participant type', async () => {
      mockUser();
      mockParticipant();
      mockApprover({
        participantTypeId: 2,
      });
      const req: Request = request(api).get('/api/participants/1/testApprover');
      const res = await withToken(req);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe(
        'Unauthorized. You do not permission to update this participant.'
      );
    });

    it('should allow access when user is the approver of the current participant type', async () => {
      mockUser();
      mockApprover([{}, {}]);
      mockParticipant([{}, {}]);

      const req: Request = request(api).get('/api/participants/1/testApprover');
      const res = await withToken(req);

      expect(res.statusCode).toBe(200);
    });
  });
});
