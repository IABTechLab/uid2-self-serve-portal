import { jest } from "@jest/globals";
import { NextFunction, Request, Response } from 'express';
import { Knex } from 'knex';

import { TestConfigure } from '../../../database/TestSelfServeDatabase';
import {
  createParticipant,
  createResponseObject,
  createUser,
  createUserParticipantRequest,
} from '../../../testHelpers/apiTestHelpers';
import { UserRoleId } from '../../entities/UserRole';
import { developerElevatedRole, uid2SupportRole } from '../../helpers/apiHelper';
import {
  isAdminOrUid2SupportCheck,
  isSuperUserCheck,
  isUid2SupportCheck,
  setPrivilegeLevel,
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
    it('should call next if requesting user has UID2 Support role', async () => {
      const participant = await createParticipant(knex, {});
      const user = await createUser({
        participantToRoles: [{ participantId: participant.id }],
      });
      const userParticipantRequest = createUserParticipantRequest(
        user.email,
        participant,
        user.id,
        [uid2SupportRole]
      );

      await isUid2SupportCheck(userParticipantRequest, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    it('should return 403 if requesting user does not have UID2 Support role', async () => {
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
       [developerElevatedRole]
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
        [uid2SupportRole]
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
        [uid2SupportRole]
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

describe('setPrivilegeLevel', () => {
  const run = async (groups?: string[]) => {
    const req = { auth: groups ? { payload: { groups } } : undefined } as unknown as Request;
    const next = jest.fn() as unknown as NextFunction;
    await setPrivilegeLevel(req, {} as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
    return req.privilegeLevel;
  };

  it('sets superuser for developer-elevated', async () => {
    expect(await run([developerElevatedRole])).toBe('superuser');
  });

  it('sets uid2-support for the support group', async () => {
    expect(await run([uid2SupportRole])).toBe('uid2-support');
  });

  it('sets superuser when the user is in both groups', async () => {
    expect(await run([uid2SupportRole, developerElevatedRole])).toBe('superuser');
  });

  it('sets standard otherwise', async () => {
    expect(await run(['some-other-group'])).toBe('standard');
    expect(await run([])).toBe('standard');
  });

  it('leaves the level unset when the request was not authenticated', async () => {
    expect(await run()).toBeUndefined();
  });
});
