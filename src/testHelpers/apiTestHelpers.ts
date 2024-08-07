import { faker } from '@faker-js/faker';
import { Response } from 'express';
import { Knex } from 'knex';

import { Participant, ParticipantStatus } from '../api/entities/Participant';
import { User, UserJobFunction } from '../api/entities/User';
import { ADMIN_USER_ROLE_ID } from '../api/entities/UserRole';
import {
  TestUserToParticipantRoleDTO,
  UserToParticipantRole,
} from '../api/entities/UserToParticipantRole';
import { CreateParticipant } from '../database/seeds/Participants';

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
  participantToRoles?: TestUserToParticipantRoleDTO[];
}) {
  const data = {
    email,
    firstName,
    lastName,
    jobFunction,
    acceptedTerms,
  };

  const user = await User.query().insert(data);
  const userToParticipantRolesData = participantToRoles?.map((item) => ({
    ...item,
    userId: user.id,
    userRoleId: item.userRoleId ?? ADMIN_USER_ROLE_ID,
  }));
  if (userToParticipantRolesData) {
    await UserToParticipantRole.query().insert(userToParticipantRolesData);
  }

  return user;
}
