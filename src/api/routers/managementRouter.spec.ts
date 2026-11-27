import { jest } from '@jest/globals';

import { TestConfigure } from '../../database/TestSelfServeDatabase';
import {
  createParticipant,
  createResponseObject,
  createUser,
} from '../../testHelpers/apiTestHelpers';
import { Participant } from '../entities/Participant';
import { UserRoleId } from '../entities/UserRole';
import { UserToParticipantRole } from '../entities/UserToParticipantRole';
import { getUserParticipants, ParticipantRequest } from '../services/participantsService';

jest.unstable_mockModule('../keycloakAdminClient', () => ({
  getKcAdminClient: jest.fn(() => Promise.resolve({})),
}));
jest.unstable_mockModule('../services/kcUsersService', () => ({
  getElevatedRole: jest.fn(() => Promise.resolve(null)),
}));

const { getElevatedRole } = await import('../services/kcUsersService');
const { handleGetUserParticipants } = await import('./managementRouter');

const addRole = (userId: number, participantId: number, userRoleId = UserRoleId.Admin) =>
  UserToParticipantRole.query().insert({ userId, participantId, userRoleId });

const requestFor = (userId: number | string) =>
  ({ params: { userId: String(userId) } }) as unknown as ParticipantRequest;

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
  test("returns 200 with only the user's participant ids and names, and the elevated role", async () => {
    const knex = await TestConfigure();
    const participant = await createParticipant(knex, {});
    await createParticipant(knex, {});
    const user = await createUser({});
    await addRole(user.id, participant.id);
    jest.mocked(getElevatedRole).mockResolvedValueOnce('superuser');
    const { res, json, status } = createResponseObject();

    await handleGetUserParticipants(requestFor(user.id), res);

    expect(status).toHaveBeenLastCalledWith(200);
    const body = json.mock.calls[0][0] as { participants: Participant[]; elevatedRole: string };
    expect(body.elevatedRole).toBe('superuser');
    expect(body.participants).toHaveLength(1);
    expect(body.participants[0]).toEqual({
      id: participant.id,
      name: participant.name,
      participantToUserRoles: [
        expect.objectContaining({ userId: user.id, participantId: participant.id }),
      ],
    });
    expect(getElevatedRole).toHaveBeenCalledWith(expect.anything(), user.email);
  });

  test('returns 404 for an unknown userId', async () => {
    const knex = await TestConfigure();
    const participant = await createParticipant(knex, {});
    const user = await createUser({});
    await addRole(user.id, participant.id);
    jest.mocked(getElevatedRole).mockClear();
    const { res, send, status } = createResponseObject();

    await handleGetUserParticipants(requestFor(999999), res);

    expect(status).toHaveBeenLastCalledWith(404);
    expect(send).toHaveBeenLastCalledWith([{ message: 'The user cannot be found.' }]);
    expect(getElevatedRole).not.toHaveBeenCalled();
  });
});
