import { TestConfigure } from '../../../database/TestSelfServeDatabase';
import {
  createParticipant,
  createResponseObject,
  createUser,
} from '../../../testHelpers/apiTestHelpers';
import { User } from '../../entities/User';
import { ParticipantRequest } from '../../services/participantsService';
import { getParticipantUsers } from './participantsUsers';

describe('#getParticipantUsers', () => {
  test('return empty list when no users', async () => {
    const knex = await TestConfigure();

    const participantObject = await createParticipant(knex, {});

    const participantRequest = {
      participant: participantObject,
    } as ParticipantRequest;

    const { res } = createResponseObject();

    await getParticipantUsers(participantRequest, res);

    expect(res.status).lastCalledWith(200);
    expect(res.json).lastCalledWith([]);
  });

  test('return list with correct user', async () => {
    const knex = await TestConfigure();
    const { res, json } = createResponseObject();

    const relatedParticipant = await createParticipant(knex, {});
    const relatedUser = await createUser({ participantId: relatedParticipant.id });

    const unrelatedParticipant = await createParticipant(knex, {});
    const unrelatedUser = await createUser({ participantId: unrelatedParticipant.id });

    const participantRequest = {
      participant: relatedParticipant,
    } as ParticipantRequest;
    await getParticipantUsers(participantRequest, res);

    expect(json).toBeCalled();

    const receivedUsers = json.mock.calls[0][0] as User[];

    expect(res.status).lastCalledWith(200);
    expect(receivedUsers.map((user) => user.id).sort()).toEqual([relatedUser.id].sort());
  });

  test('return list with multiple correct user', async () => {
    const knex = await TestConfigure();
    const { res, json } = createResponseObject();

    const relatedParticipant = await createParticipant(knex, {});
    const relatedUsers = [
      await createUser({ participantId: relatedParticipant.id }),
      await createUser({ participantId: relatedParticipant.id }),
    ];

    const unrelatedParticipant = await createParticipant(knex, {});
    await createUser({ participantId: unrelatedParticipant.id });

    const participantRequest = {
      participant: relatedParticipant,
    } as ParticipantRequest;
    await getParticipantUsers(participantRequest, res);

    expect(json).toBeCalled();

    const receivedUsers = json.mock.calls[0][0] as User[];

    expect(res.status).lastCalledWith(200);
    expect(receivedUsers.map((user) => user.id).sort()).toEqual(
      relatedUsers.map((user) => user.id).sort()
    );
  });
});
