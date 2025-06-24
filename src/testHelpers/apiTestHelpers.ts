import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { Response } from 'express';
import { Knex } from 'knex';

import { ModelObjectOpt } from '../api/entities/ModelObjectOpt';
import { Participant } from '../api/entities/Participant';
import { User, UserJobFunction } from '../api/entities/User';
import { UserRoleId } from '../api/entities/UserRole';
import { UserToParticipantRole } from '../api/entities/UserToParticipantRole';
import { ParticipantRequest, UserParticipantRequest } from '../api/services/participantsService';
import { findUserByEmail } from '../api/services/usersService';
import { CreateParticipant } from '../database/seeds/Participants';

type ParticipantToUserRoleDTO = Partial<
  Pick<ModelObjectOpt<UserToParticipantRole>, 'participantId' | 'userRoleId'>
>;

export function createResponseObject() {
  type JsonFn = (body: unknown) => Response;
  type SendFn = (body: unknown) => Response;
  type StatusFn = (code: number) => Response;

  const json = jest.fn<JsonFn>((body: unknown) => { void body; return res; });
  const send = jest.fn<SendFn>((body: unknown) => { void body; return res; });
  const status = jest.fn<StatusFn>((code: number) => { void code; return res; });

  const res = {
    json,
    send,
    status,
  } as unknown as Response;

  return { res, json, send, status };
}

export const createParticipantRequest = (
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

export const createUserParticipantRequest = (
  requestingUserEmail: string,
  requestingParticipant: Participant,
  targetUserId: number
): UserParticipantRequest => {
  return {
    auth: {
      payload: {
        email: requestingUserEmail,
      },
    },
    participant: requestingParticipant,
    params: {
      userId: targetUserId,
    },
    headers: {
      traceId: faker.string.uuid(),
    },
  } as unknown as UserParticipantRequest;
};

export async function createParticipant(
  knex: Knex,
  {
    name = faker.company.name(),
    allowSharing = true,
    type = 'Publisher',
    apiRoleNames = [],
    completedRecommendations = false,
    crmAgreementNumber = '12345678',
  }: {
    name?: string;
    allowSharing?: boolean;
    type?: string;
    completedRecommendations?: boolean;
    apiRoleNames?: string[];
    crmAgreementNumber?: string;
  }
) {
  const data = {
    name,
    allowSharing,
    completedRecommendations,
    crmAgreementNumber,
  };

  const participantId = await CreateParticipant(knex, data, type, apiRoleNames);
  const participant = await Participant.query().findById(participantId);
  return participant!;
}

export async function createUser({
  email = faker.internet.email(),
  firstName = faker.person.firstName(),
  lastName = faker.person.lastName(),
  jobFunction = UserJobFunction.DA,
  acceptedTerms = true,
  participantToRoles,
}: {
  email?: string;
  firstName?: string;
  lastName?: string;
  jobFunction?: UserJobFunction;
  acceptedTerms?: boolean;
  participantToRoles?: ParticipantToUserRoleDTO[];
}) {
  const data = {
    email,
    firstName,
    lastName,
    jobFunction,
    acceptedTerms,
  };

  const user = await User.query().insert(data);

  participantToRoles?.map(async (item) => {
    const myData = {
      ...item,
      userId: user.id,
      userRoleId: item.userRoleId ?? UserRoleId.Admin,
    };
    await UserToParticipantRole.query().insert(myData);
  });

  return user;
}

export async function getParticipantIdsOfUser(userEmail: string) {
  const user = await findUserByEmail(userEmail);
  return user?.participants?.map((participant) => participant.id);
}
