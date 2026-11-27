import { TestConfigure } from '../../database/TestSelfServeDatabase';
import {
  createParticipant,
  createResponseObject,
  createUser,
} from '../../testHelpers/apiTestHelpers';
import { UserRoleId } from '../entities/UserRole';
import { UserToParticipantRole } from '../entities/UserToParticipantRole';
import { getUserParticipants, ParticipantRequest } from '../services/participantsService';
import { handleGetUserParticipants } from './managementRouter';

const addRole = (userId: number, participantId: number, userRoleId = UserRoleId.Admin) =>
  UserToParticipantRole.query().insert({ userId, participantId, userRoleId });

describe('#getUserParticipants', () => {
  test('returns only the participants the user belongs to, with only their role rows', async () => {
    const knex = await TestConfigure();
    const participantA = await createParticipant(knex, {});
    const participantB = await createParticipant(knex, {});
    const unrelatedParticipant = await createParticipant(knex, {});
    const user = await createUser({});
    const otherUser = await createUser({});
    await addRole(user.id, participantA.id, UserRoleId.Admin);
    await addRole(user.id, participantB.id, UserRoleId.Operations);
    await addRole(otherUser.id, participantA.id);
    await addRole(otherUser.id, unrelatedParticipant.id);

    const participants = await getUserParticipants(user.id);

    expect(participants.map((p) => p.id).sort()).toEqual([participantA.id, participantB.id].sort());
    participants.forEach((p) => {
      expect(p.participantToUserRoles?.map((r) => r.userId)).toEqual([user.id]);
    });
  });

  test('returns an empty list for a user with no participants', async () => {
    const knex = await TestConfigure();
    const participant = await createParticipant(knex, {});
    const otherUser = await createUser({});
    await addRole(otherUser.id, participant.id);
    const user = await createUser({});

    expect(await getUserParticipants(user.id)).toEqual([]);
  });
});

describe('#handleGetUserParticipants', () => {
  test('returns 404 for an unknown userId', async () => {
    const knex = await TestConfigure();
    const participant = await createParticipant(knex, {});
    const user = await createUser({});
    await addRole(user.id, participant.id);
    const { res, json, status } = createResponseObject();

    await handleGetUserParticipants({ params: { userId: '999999' } } as unknown as ParticipantRequest, res);

    expect(status).toHaveBeenLastCalledWith(404);
    expect(json).not.toHaveBeenCalled();
  });
});
