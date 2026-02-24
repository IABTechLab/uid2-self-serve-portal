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
import { uid2SupportRole } from '../userRoleMiddleware';
import { verifyAndEnrichUser } from '../usersMiddleware';

describe('User Middleware Tests', () => {
  let knex: Knex;
  let next: NextFunction;
  let res: Response;

  beforeEach(async () => {
    knex = await TestConfigure();
    next = jest.fn();
    ({ res } = createResponseObject());
  });

  it('should call next if requesting user belongs to participant', async () => {
    const participant = await createParticipant(knex, {});
    const user = await createUser({
      participantToRoles: [{ participantId: participant.id }],
    });
    const userParticipantRequest = createUserParticipantRequest(user.email, participant, user.id);

    await verifyAndEnrichUser(userParticipantRequest, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
  it('should call next if requesting user is UID2 support, even if requesting user does not belong to participant', async () => {
    const requestorParticipant = await createParticipant(knex, {});
    const targetParticipant = await createParticipant(knex, {});
    const uid2SupportUser = await createUser({
      participantToRoles: [{ participantId: requestorParticipant.id }],
    });
    const targetUser = await createUser({
      participantToRoles: [{ participantId: targetParticipant.id }],
    });
    const userParticipantRequest = createUserParticipantRequest(
      uid2SupportUser.email,
      targetParticipant,
      targetUser.id,
      [uid2SupportRole]
    );

    await verifyAndEnrichUser(userParticipantRequest, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
  it('should return 404 if user is not found', async () => {
    const requestorParticipant = await createParticipant(knex, {});
    const requestingUser = await createUser({
      participantToRoles: [{ participantId: requestorParticipant.id }],
    });
    const nonExistentUserId = 2;
    const userParticipantRequest = createUserParticipantRequest(
      requestingUser.email,
      requestorParticipant,
      nonExistentUserId
    );

    await verifyAndEnrichUser(userParticipantRequest, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith([{ message: 'The user cannot be found.' }]);
  });
  it('should return 404 if participant is not found', async () => {
    const requestingUser = await createUser({});
    const unrelatedParticipant = await createParticipant(knex, {});
    const userParticipantRequest = createUserParticipantRequest(
      requestingUser.email,
      unrelatedParticipant,
      requestingUser.id
    );

    await verifyAndEnrichUser(userParticipantRequest, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith([
      { message: 'The participant for that user cannot be found.' },
    ]);
  });
  it('should return 403 if requesting user does not have access to participant', async () => {
    const requestorParticipant = await createParticipant(knex, {});
    const requestingUser = await createUser({
      participantToRoles: [{ participantId: requestorParticipant.id }],
    });
    const anotherParticipant = await createParticipant(knex, {});
    const anotherUser = await createUser({
      participantToRoles: [{ participantId: anotherParticipant.id }],
    });
    const userParticipantRequest = createUserParticipantRequest(
      requestingUser.email,
      anotherParticipant,
      anotherUser.id
    );

    await verifyAndEnrichUser(userParticipantRequest, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith([
      { message: 'You do not have permission to that user account.' },
    ]);
  });
  it('should return 404 if user does not belong to participant', async () => {
    const requestorParticipant = await createParticipant(knex, {});
    const requestingUser = await createUser({
      participantToRoles: [{ participantId: requestorParticipant.id }],
    });
    const anotherParticipant = await createParticipant(knex, {});
    const anotherUser = await createUser({
      participantToRoles: [{ participantId: anotherParticipant.id }],
    });
    const userParticipantRequest = createUserParticipantRequest(
      requestingUser.email,
      requestorParticipant,
      anotherUser.id
    );

    await verifyAndEnrichUser(userParticipantRequest, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith([{ message: 'The user cannot be found.' }]);
  });
});
