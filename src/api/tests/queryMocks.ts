import { jest } from '@jest/globals';
import { Model, ModelClass, QueryBuilder } from 'objection';

import { ContactType, EmailContact } from '../entities/EmailContact';
import { Participant } from '../entities/Participant';
import { User } from '../entities/User';
import { UserRoleId } from '../entities/UserRole';

// The mocked result already holds the related rows, so skip the real graph fetch.
const resolveWithoutGraphFetch = <M extends Model>(modelClass: ModelClass<M>, value: unknown) =>
  QueryBuilder.forClass(modelClass)
    .resolve(value as M)
    .onBuild((builder) => builder.clearWithGraph());

type PartialParticipantOrNull = Partial<Participant> | null;
export const mockParticipant = (
  participant: PartialParticipantOrNull | PartialParticipantOrNull[] = {}
) => {
  const participants = Array.isArray(participant) ? participant : [participant];

  const spy = jest.spyOn(Participant, 'query');

  participants.forEach((p) =>
    spy.mockImplementation(() =>
      resolveWithoutGraphFetch(Participant,
        p === null
          ? undefined
          : {
              id: 1,
              name: 'Test Participant',
              allowSharing: true,
              types: [
                {
                  id: 1,
                  typeName: 'DSP',
                },
              ],
              ...p,
            }
      )
    )
  );
};

type PartialUserOrNull = Partial<User> | null;
export const mockUser = (user: PartialUserOrNull | PartialUserOrNull[] = {}) => {
  const users = Array.isArray(user) ? user : [user];
  const spy = jest.spyOn(User, 'query');
  users.forEach((u) =>
    spy.mockImplementation(() =>
      resolveWithoutGraphFetch(User,
        u === null
          ? undefined
          : {
              id: 1,
              email: 'test_user@example.com',
              name: 'Test User',
              participants: u.participants ?? [
                {
                  id: 1,
                  name: 'Test Participant',
                  allowSharing: true,
                  participantToUserRoles: [{ userId: 1, userRoleId: UserRoleId.Admin }],
                  types: [
                    {
                      id: 1,
                      typeName: 'DSP',
                    },
                  ],
                },
              ],
              ...u,
            }
      )
    )
  );
};

export const mockEmailContact = (emailContact: Partial<EmailContact> | null = {}) => {
  jest.spyOn(EmailContact, 'query').mockReturnValueOnce(
    QueryBuilder.forClass(EmailContact).resolve(
      emailContact === null
        ? undefined
        : {
            id: 1,
            name: 'Test Contact',
            emailAlias: 'Test.contact@test.com',
            contactType: ContactType.Business,
            participantId: 1,
            ...emailContact,
          }
    )
  );
};
