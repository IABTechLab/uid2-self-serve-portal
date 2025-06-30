import { jest } from "@jest/globals";
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
import { UserService } from '../services/userService';

jest.unstable_mockModule('../services/kcUsersService', () => ({
	removeApiParticipantMemberRole: jest.fn(() => {})
}));

const { removeApiParticipantMemberRole } = await import ('../services/kcUsersService');

describe('User Service Tests', () => {
  let knex: Knex;
  let next: NextFunction;
  let res: Response;

  beforeEach(async () => {
    knex = await TestConfigure();
    next = jest.fn();
    ({ res } = createResponseObject());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('User removal', () => {
    describe('User still belongs to a participant', () => {
      it('removes the user from the correct participant and keycloak rules are unchanged', async () => {
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

        expect(removeApiParticipantMemberRole).not.toHaveBeenCalled();
      });
    });
		// Test skipped until jest mocking + ESM + keycloak has a better solution
	describe('User is removed from their only participant', () => {
		it.skip('removes the user from their only participant and removes the keycloak role', async () => {
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

			expect(removeApiParticipantMemberRole).toHaveBeenCalledWith(
				expect.anything(),
				user.email
			);
		});
		});
  });
});
