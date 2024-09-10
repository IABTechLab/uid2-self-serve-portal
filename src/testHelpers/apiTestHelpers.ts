import { faker } from '@faker-js/faker';
import { Response } from 'express';
import { Knex } from 'knex';

import { ModelObjectOpt } from '../api/entities/ModelObjectOpt';
import { Participant, ParticipantStatus } from '../api/entities/Participant';
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
  const res = {} as unknown as Response;
  const json = jest.fn();
  res.json = json;
  const send = jest.fn();
  res.send = send;
  const status = jest.fn(() => res);
  res.status = status;
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
  } as unknown as UserParticipantRequest;
};

export async function createParticipant(
  knex: Knex,
  {
    name = faker.company.name(),
    allowSharing = true,
    status = ParticipantStatus.Approved,
    type = 'Publisher',
    apiRoleNames = [],
    completedRecommendations = false,
    crmAgreementNumber = '12345678',
  }: {
    name?: string;
    allowSharing?: boolean;
    status?: ParticipantStatus;
    type?: string;
    completedRecommendations?: boolean;
    apiRoleNames?: string[];
    crmAgreementNumber?: string;
  }
) {
  const data = {
    name,
    allowSharing,
    status,
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
