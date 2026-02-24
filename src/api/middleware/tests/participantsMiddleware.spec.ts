import { jest } from "@jest/globals";
import { NextFunction, Response } from 'express';
import { Knex } from 'knex';

import { TestConfigure } from '../../../database/TestSelfServeDatabase';
import {
  createParticipant,
  createParticipantRequest,
  createResponseObject,
  createUser,
} from '../../../testHelpers/apiTestHelpers';
import { verifyAndEnrichParticipant } from '../participantsMiddleware';
import { uid2SupportRole } from '../userRoleMiddleware';

describe('Participant Middleware Tests', () => {
  let knex: Knex;
  let next: NextFunction;
  let res: Response;

  beforeEach(async () => {
    knex = await TestConfigure();
    next = jest.fn();
    ({ res } = createResponseObject());
  });

  it('should call next if participantId is valid and user belongs to participant', async () => {
    const relatedParticipant = await createParticipant(knex, {});
    const relatedUser = await createUser({
      participantToRoles: [{ participantId: relatedParticipant.id }],
    });
    const participantRequest = createParticipantRequest(relatedUser.email, relatedParticipant.id);

    await verifyAndEnrichParticipant(participantRequest, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
  it('should call next if user is UID2 support, even if user does not belong to participant', async () => {
    const firstParticipant = await createParticipant(knex, {});
    const secondParticipant = await createParticipant(knex, {});
    const uid2SupportUser = await createUser({
      participantToRoles: [{ participantId: firstParticipant.id }],
    });
    const participantRequest = createParticipantRequest(
      uid2SupportUser.email,
      secondParticipant.id,
      [uid2SupportRole]
    );

    await verifyAndEnrichParticipant(participantRequest, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
  it('should return 404 if participant is not found', async () => {
    const relatedParticipant = await createParticipant(knex, {});
    const relatedUser = await createUser({
      participantToRoles: [{ participantId: relatedParticipant.id }],
    });
    const nonExistentParticipantId = 2;
    const participantRequest = createParticipantRequest(
      relatedUser.email,
      nonExistentParticipantId
    );

    await verifyAndEnrichParticipant(participantRequest, res, next);
    expect(participantRequest.participant).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
  it('should return 403 if user does not have access to participant', async () => {
    const firstParticipant = await createParticipant(knex, {});
    const secondParticipant = await createParticipant(knex, {});
    const relatedUser = await createUser({
      participantToRoles: [
        {
          participantId: secondParticipant.id,
        },
      ],
    });
    const participantRequest = createParticipantRequest(relatedUser.email, firstParticipant.id);

    await verifyAndEnrichParticipant(participantRequest, res, next);

    expect(participantRequest.participant).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
