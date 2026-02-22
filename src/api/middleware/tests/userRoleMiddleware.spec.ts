import { jest } from "@jest/globals";
import { NextFunction, Response } from 'express';
import { Knex } from 'knex';

import { TestConfigure } from '../../../database/TestSelfServeDatabase';
import {
  createParticipant,
  createResponseObject,
  createUser,
  createUserParticipantRequest,
} from '../../../testHelpers/apiTestHelpers';
import { UserRoleId } from '../../entities/UserRole';
import {
  isAdminOrUid2SupportCheck,
  isSuperUserCheck,
  isUid2SupportCheck,
} from '../userRoleMiddleware';

describe('User Role Middleware Tests', () => {
  let knex: Knex;
  let next: NextFunction;
  let res: Response;

  beforeEach(async () => {
    knex = await TestConfigure();
    next = jest.fn();
    ({ res } = createResponseObject());
  });
  describe('UID2 Support check', () => {
    it('should call next if requesting user has UID2 support role', async () => {
      const participant = await createParticipant(knex, {});
      const user = await createUser({
        participantToRoles: [{ participantId: participant.id }],
      });
      const userParticipantRequest = createUserParticipantRequest(
        user.email,
        participant,
        user.id,
        ['prod-uid2.0-support']
      );

      await isUid2SupportCheck(userParticipantRequest, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    it('should return 403 if requesting user does not have UID2 support role', async () => {
      const participant = await createParticipant(knex, {});
      const user = await createUser({
        participantToRoles: [{ participantId: participant.id, userRoleId: UserRoleId.Admin }],
      });
      const userParticipantRequest = createUserParticipantRequest(user.email, participant, user.id);

      await isUid2SupportCheck(userParticipantRequest, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
  describe('SuperUser check', () => {
    it('should call next if requesting user has the SuperUser role', async () => {
      const participant = await createParticipant(knex, {});
      const user = await createUser({
        participantToRoles: [{ participantId: participant.id }],
      });
      const userParticipantRequest = createUserParticipantRequest(
        user.email,
        participant,
        user.id,
        ['developer-elevated']
      );

      await isSuperUserCheck(userParticipantRequest, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    it('should return 403 if requesting user does not have SuperUser role', async () => {
      const participant = await createParticipant(knex, {});
      const user = await createUser({
        participantToRoles: [{ participantId: participant.id }],
      });
      const userParticipantRequest = createUserParticipantRequest(
        user.email,
        participant,
        user.id,
        ['prod-uid2.0-support']
      );

      await isSuperUserCheck(userParticipantRequest, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
  describe('Admin Role or UID2 Support check', () => {
    it('should call next if requesting user has Admin role for the participant', async () => {
      const participant = await createParticipant(knex, {});
      const user = await createUser({
        participantToRoles: [{ participantId: participant.id, userRoleId: UserRoleId.Admin }],
      });
      const userParticipantRequest = createUserParticipantRequest(user.email, participant, user.id);

      await isAdminOrUid2SupportCheck(userParticipantRequest, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    it('should call next if requesting user has UID2 support role', async () => {
      const participant = await createParticipant(knex, {});
      const user = await createUser({
        participantToRoles: [{ participantId: participant.id }],
      });
      const userParticipantRequest = createUserParticipantRequest(
        user.email,
        participant,
        user.id,
        ['prod-uid2.0-support']
      );

      await isAdminOrUid2SupportCheck(userParticipantRequest, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    it('should return 403 if requesting user does not have Admin role for the participant', async () => {
      const participant = await createParticipant(knex, {});
      const user = await createUser({
        participantToRoles: [{ participantId: participant.id, userRoleId: UserRoleId.Operations }],
      });
      const userParticipantRequest = createUserParticipantRequest(user.email, participant, user.id);

      await isAdminOrUid2SupportCheck(userParticipantRequest, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
