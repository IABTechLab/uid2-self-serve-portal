import { NextFunction, Response } from 'express';
import { Knex } from 'knex';

import { TestConfigure } from '../../database/TestSelfServeDatabase';
import {
  createParticipant,
  createResponseObject,
  createUser,
} from '../../testHelpers/apiTestHelpers';
import { checkParticipantId, ParticipantRequest } from '../services/participantsService';

const createParticipantRequest = (
  email: string,
  participantId: string | number
): ParticipantRequest => {
  return {
    auth: {
      payload: {
        email,
      },
    },
    params: {
      participantId,
    },
  } as unknown as ParticipantRequest;
};

describe('Participant Service Tests', () => {
  let knex: Knex;
  let next: NextFunction;
  let res: Response;

  beforeEach(async () => {
    knex = await TestConfigure();
    next = jest.fn();
    ({ res } = createResponseObject());
  });
  // TODO: move these middleware tests to a middleware spec file
  describe('checkParticipantId middleware', () => {
    describe('when participantId is specified', () => {
      it('should call next if participantId is valid and user has access', async () => {
        const relatedParticipant = await createParticipant(knex, {});
        const relatedUser = await createUser({ participantId: relatedParticipant.id });
        const participantRequest = createParticipantRequest(
          relatedUser.email,
          relatedParticipant.id
        );

        await checkParticipantId(participantRequest, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      });

      it('should return 404 if participant is not found', async () => {
        const relatedParticipant = await createParticipant(knex, {});
        const relatedUser = await createUser({ participantId: relatedParticipant.id });
        const nonExistentParticipantId = 2;
        const participantRequest = createParticipantRequest(
          relatedUser.email,
          nonExistentParticipantId
        );

        await checkParticipantId(participantRequest, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith([{ message: 'The participant cannot be found.' }]);
      });

      it('should return 403 if user does not have access to participant', async () => {
        const firstParticipant = await createParticipant(knex, {});
        const secondParticipant = await createParticipant(knex, {});
        const relatedUser = await createUser({ participantId: secondParticipant.id });
        const participantRequest = createParticipantRequest(relatedUser.email, firstParticipant.id);

        await checkParticipantId(participantRequest, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith([
          { message: 'You do not have permission to that participant.' },
        ]);
      });
    });
    // TODO: these will change in UID2-2822
    describe(`when participantId is 'current'`, () => {
      it('should call next if user has a valid participant', async () => {
        const relatedParticipant = await createParticipant(knex, {});
        const relatedUser = await createUser({ participantId: relatedParticipant.id });
        const participantRequest = createParticipantRequest(relatedUser.email, 'current');

        await checkParticipantId(participantRequest, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      });
      it('should return 404 is user is not found', async () => {
        const participantRequest = createParticipantRequest('doesNotMatter@example.com', 'current');

        await checkParticipantId(participantRequest, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith([{ message: 'The user cannot be found.' }]);
      });
      it('should return 404 is participant is not found', async () => {
        const relatedUser = await createUser({});
        const participantRequest = createParticipantRequest(relatedUser.email, 'current');

        await checkParticipantId(participantRequest, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith([{ message: 'The participant cannot be found.' }]);
      });
    });
  });
});
