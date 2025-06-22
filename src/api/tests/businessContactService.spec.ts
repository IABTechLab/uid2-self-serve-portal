import request, { Request } from 'supertest';
import {jest} from "@jest/globals";
import { ContactType } from '../entities/BusinessContact';
import { BusinessContactRequest } from '../services/businessContactsService';
import { mockBusinessContact, mockParticipant, mockUser } from './queryMocks';
import useTestServer, { api, routers } from './utils';

describe('Business Contact Service Tests', () => {
  const withToken = useTestServer();

  beforeAll(async () => {
    routers!.participantsRouter.businessContactsRouter.get(
      '/:contactId',
      (req: BusinessContactRequest, res) => {
        res.status(200).json(req.businessContact);
      }
    );
  });

  afterEach(async() => {
    jest.restoreAllMocks();
  });

  describe('hasBusinessContactAccess middleware', () => {
    it('should allow access when business contact belongs to participant', async () => {
      mockUser();
      mockParticipant();
      mockBusinessContact();
      const req: Request = request(api).get('/api/participants/1/businessContacts/1');
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

    it('should deny access when business contact does not belong to participant', async () => {
      mockUser();
      mockParticipant();
      mockBusinessContact({ participantId: 2 });

      const req: Request = request(api).get('/api/participants/1/businessContacts/1');
      const res = await withToken(req);

      expect(res.statusCode).toBe(403);
      expect(res.body[0].message).toBe('You do not have permission to that business contact.');
    });

    it('should throw error when business contact does not exist', async () => {
      mockUser();
      mockParticipant();
      mockBusinessContact(null);

      const req: Request = request(api).get('/api/participants/1/businessContacts/1');
      const res = await withToken(req);

      expect(res.statusCode).toBe(404);
      expect(res.body[0].message).toBe('The business contact cannot be found.');
    });
  });
});
