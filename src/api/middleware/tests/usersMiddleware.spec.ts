import { NextFunction, Response } from 'express';
import { Knex } from 'knex';

import { TestConfigure } from '../../../database/TestSelfServeDatabase';
import {
  createParticipant,
  createResponseObject,
  createUser,
} from '../../../testHelpers/apiTestHelpers';
import { UserRoleId } from '../../entities/UserRole';
import { UserRequest } from '../../services/usersService';
import { enrichWithUserFromParams } from '../usersMiddleware';

const createUserRequest = (email: string, userId: string | number): UserRequest => {
  return {
    auth: {
      payload: {
        email,
      },
    },
    params: {
      userId,
    },
  } as unknown as UserRequest;
};

describe('User Service Tests', () => {
  let knex: Knex;
  let next: NextFunction;
  let res: Response;

  beforeEach(async () => {
    knex = await TestConfigure();
    next = jest.fn();
    ({ res } = createResponseObject());
  });

  describe('enrichWithUserFromParams middleware', () => {
    it('should call next if user belongs to participant', async () => {
      const relatedParticipant = await createParticipant(knex, {});
      const relatedUser = await createUser({
        participantToRoles: [{ participantId: relatedParticipant.id }],
      });
      const userRequest = createUserRequest(relatedUser.email, relatedUser.id);

      await enrichWithUserFromParams(userRequest, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    it('should call next if user is UID2 support, even if user does not belong to participant', async () => {
      const firstParticipant = await createParticipant(knex, {});
      const secondParticipant = await createParticipant(knex, {});
      const uid2SupportUser = await createUser({
        participantToRoles: [
          { participantId: firstParticipant.id, userRoleId: UserRoleId.UID2Support },
        ],
      });
      const secondUser = await createUser({
        participantToRoles: [{ participantId: secondParticipant.id }],
      });
      const userRequest = createUserRequest(uid2SupportUser.email, secondUser.id);

      await enrichWithUserFromParams(userRequest, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should return 404 if user is not found', async () => {
      const relatedParticipant = await createParticipant(knex, {});
      const relatedUser = await createUser({
        participantToRoles: [{ participantId: relatedParticipant.id }],
      });
      const nonExistentUserId = 2;
      const userRequest = createUserRequest(relatedUser.email, nonExistentUserId);

      await enrichWithUserFromParams(userRequest, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith([{ message: 'The user cannot be found.' }]);
    });
    it('should return 404 if participant is not found', async () => {
      const relatedUser = await createUser({});
      const userRequest = createUserRequest(relatedUser.email, relatedUser.id);

      await enrichWithUserFromParams(userRequest, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith([
        { message: 'The participant for that user cannot be found.' },
      ]);
    });
    it('should return 403 if user does not have access to participant', async () => {
      const firstParticipant = await createParticipant(knex, {});
      const secondParticipant = await createParticipant(knex, {});
      const firstUser = await createUser({
        participantToRoles: [{ participantId: firstParticipant.id }],
      });
      const secondUser = await createUser({
        participantToRoles: [{ participantId: secondParticipant.id }],
      });
      const userRequest = createUserRequest(secondUser.email, firstUser.id);

      await enrichWithUserFromParams(userRequest, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith([
        { message: 'You do not have permission to that user account.' },
      ]);
    });
  });
});
