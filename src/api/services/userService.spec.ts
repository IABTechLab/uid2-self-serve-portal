import { NextFunction, Response } from 'express';
import { Knex } from 'knex';

import { TestConfigure } from '../../database/TestSelfServeDatabase';
import {
  createParticipant,
  createResponseObject,
  createUser,
  createUserParticipantRequest,
  getParticipantIdsOfUser,
} from '../../testHelpers/apiTestHelpers';
import { verifyAndEnrichUser } from '../middleware/usersMiddleware';
import * as kcUsersService from './kcUsersService';
import { UserService } from './userService';

describe('User Service Tests', () => {
  let knex: Knex;
  let next: NextFunction;
  let res: Response;

  beforeEach(async () => {
    knex = await TestConfigure();
    next = jest.fn();
    ({ res } = createResponseObject());
    jest.spyOn(kcUsersService, 'removeApiParticipantMemberRole').mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('User removal', () => {
    describe('User still belongs to a participant', () => {
      it('removes the user from the correct participant', async () => {
        const targetParticipant = await createParticipant(knex, {});
        const anotherParticipant = await createParticipant(knex, {});
        const user = await createUser({
          participantToRoles: [
            { participantId: targetParticipant.id },
            { participantId: anotherParticipant.id },
          ],
        });
        const request = createUserParticipantRequest(user.email, targetParticipant, user.id);
        await verifyAndEnrichUser(request, res, next);

        const userService = new UserService();
        await userService.removeUser(request);

        const userParticipantIds = await getParticipantIdsOfUser(user.email);
        expect(userParticipantIds).not.toContain(targetParticipant.id);
        expect(userParticipantIds).toContain(anotherParticipant.id);
      });
    });
    it('user keycloak roles are unchanged', async () => {
      const targetParticipant = await createParticipant(knex, {});
      const anotherParticipant = await createParticipant(knex, {});
      const user = await createUser({
        participantToRoles: [
          { participantId: targetParticipant.id },
          { participantId: anotherParticipant.id },
        ],
      });
      const request = createUserParticipantRequest(user.email, targetParticipant, user.id);
      await verifyAndEnrichUser(request, res, next);

      const userService = new UserService();
      await userService.removeUser(request);

      expect(kcUsersService.removeApiParticipantMemberRole).not.toHaveBeenCalled();
    });
    describe('User is removed from their only participant', () => {
      it('removes the user from their only participant', async () => {
        const participant = await createParticipant(knex, {});
        const user = await createUser({
          participantToRoles: [{ participantId: participant.id }],
        });
        const request = createUserParticipantRequest(user.email, participant, user.id);
        await verifyAndEnrichUser(request, res, next);

        const userService = new UserService();
        await userService.removeUser(request);

        const userParticipantIds = await getParticipantIdsOfUser(user.email);
        expect(userParticipantIds).not.toContain(participant.id);
      });
      it('removes the Keycloak role when the user has no participants left', async () => {
        const participant = await createParticipant(knex, {});
        const user = await createUser({
          participantToRoles: [{ participantId: participant.id }],
        });
        const request = createUserParticipantRequest(user.email, participant, user.id);
        await verifyAndEnrichUser(request, res, next);

        const userService = new UserService();
        await userService.removeUser(request);

        expect(kcUsersService.removeApiParticipantMemberRole).toHaveBeenCalledWith(
          expect.anything(),
          user.email
        );
      });
    });
  });
});
