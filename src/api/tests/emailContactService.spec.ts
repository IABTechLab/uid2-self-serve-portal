import { jest } from '@jest/globals';
import request, { Request } from 'supertest';

import { ContactType } from '../entities/EmailContact';
import { EmailContactRequest } from '../services/emailContactsService';
import { mockEmailContact, mockParticipant, mockUser } from './queryMocks';
import useTestServer, { api, routers } from './utils';

describe('Business Contact Service Tests', () => {
  const withToken = useTestServer();

  beforeAll(() => {
    routers!.participantsRouter.emailContactsRouter.get(
      '/:contactId',
      (req: EmailContactRequest, res) => {
        res.status(200).json(req.emailContact);
      }
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('hasEmailContactAccess middleware', () => {
    it('should allow access when email contact belongs to participant', async () => {
      mockUser();
      mockParticipant();
      mockEmailContact();
      const req: Request = request(api).get('/api/participants/1/emailContacts/1');
      const res = await withToken(req);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        id: 1,
        name: 'Test Contact',
        emailAlias: 'Test.contact@test.com',
        contactType: ContactType.Business,
        participantId: 1,
      });
    });

    it('should deny access when email contact does not belong to participant', async () => {
      mockUser();
      mockParticipant();
      mockEmailContact({ participantId: 2 });

      const req: Request = request(api).get('/api/participants/1/emailContacts/1');
      const res = await withToken(req);

      expect(res.statusCode).toBe(403);
      expect(res.body[0].message).toBe('You do not have permission to that email contact.');
    });

    it('should throw error when email contact does not exist', async () => {
      mockUser();
      mockParticipant();
      mockEmailContact(null);

      const req: Request = request(api).get('/api/participants/1/emailContacts/1');
      const res = await withToken(req);

      expect(res.statusCode).toBe(404);
      expect(res.body[0].message).toBe('The email contact cannot be found.');
    });
  });
});
