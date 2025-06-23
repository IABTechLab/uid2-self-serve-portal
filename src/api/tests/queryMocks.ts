import { QueryBuilder } from 'objection';
import {jest} from "@jest/globals";
import { BusinessContact, ContactType } from '../entities/BusinessContact';
import { Participant } from '../entities/Participant';
import { User } from '../entities/User';

type PartialParticipantOrNull = Partial<Participant> | null;
export const mockParticipant = (
  participant: PartialParticipantOrNull | PartialParticipantOrNull[] = {}
) => {
  const participants = Array.isArray(participant) ? participant : [participant];

  const spy = jest.spyOn(Participant, 'query');

  participants.forEach((p) =>
    spy.mockReturnValue(
      QueryBuilder.forClass(Participant).resolve(
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
    spy.mockReturnValue(
      QueryBuilder.forClass(User).resolve(
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

export const mockUserOnce = (user: PartialUserOrNull | PartialUserOrNull[] = {}) => {
  const users = Array.isArray(user) ? user : [user];
  const spy = jest.spyOn(User, 'query');
  users.forEach((u) =>
    spy.mockReturnValueOnce(
      QueryBuilder.forClass(User).resolve(
        u === null
          ? undefined
          : {
              id: 1,
              email: 'test_user@example.com',
              name: 'Test User',
              ...u,
            }
      )
    )
  );
};

export const mockBusinessContact = (businessContact: Partial<BusinessContact> | null = {}) => {
  jest.spyOn(BusinessContact, 'query').mockReturnValueOnce(
    QueryBuilder.forClass(BusinessContact).resolve(
      businessContact === null
        ? undefined
        : {
            id: 1,
            name: 'Test Contact',
            emailAlias: 'Test.contact@test.com',
            contactType: ContactType.Business,
            participantId: 1,
            ...businessContact,
          }
    )
  );
};
