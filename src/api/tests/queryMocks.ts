import { QueryBuilder } from 'objection';

import { Approver } from '../entities/Approver';
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
    spy.mockReturnValueOnce(
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
  const testUserId = 1;
  const testParticipantId = 2;
  users.forEach((u) =>
    spy.mockReturnValue(
      QueryBuilder.forClass(User).resolve(
        u === null
          ? undefined
          : {
              id: testUserId,
              email: 'test_user@example.com',
              name: 'Test User',
              $relatedQuery: () =>
                QueryBuilder.forClass(Participant).resolve({
                  id: testParticipantId,
                  name: 'Test Participant',
                }),
              ...u,
            }
      )
    )
  );
};

export const mockUserWithNoParticipant = (user: PartialUserOrNull | PartialUserOrNull[] = {}) => {
  const users = Array.isArray(user) ? user : [user];
  const spy = jest.spyOn(User, 'query');
  const testUserId = 1;
  users.forEach((u) =>
    spy.mockReturnValue(
      QueryBuilder.forClass(User).resolve(
        u === null
          ? undefined
          : {
              id: testUserId,
              email: 'test_user@example.com',
              name: 'Test User',
              $relatedQuery: () => QueryBuilder.forClass(Participant).resolve(undefined),
              ...u,
            }
      )
    )
  );
};

export const mockUserOnce = (user: PartialUserOrNull | PartialUserOrNull[] = {}) => {
  const users = Array.isArray(user) ? user : [user];
  const spy = jest.spyOn(User, 'query');
  const testUserId = 1;
  users.forEach((u) =>
    spy.mockReturnValueOnce(
      QueryBuilder.forClass(User).resolve(
        u === null
          ? undefined
          : {
              id: testUserId,
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

type PartialApproverOrNull = Partial<Approver> | null;
export const mockApprover = (approver: PartialApproverOrNull | PartialApproverOrNull[] = {}) => {
  const approvers = Array.isArray(approver) ? approver : [approver];
  approvers.forEach((a) => {
    jest.spyOn(Approver, 'query').mockReturnValueOnce(
      QueryBuilder.forClass(Approver).resolve(
        a === null
          ? undefined
          : [
              {
                id: 1,
                email: 'test_user@example.com',
                displayName: 'Test Admin',
                participantTypeId: 1,
                ...a,
              },
            ]
      )
    );
  });
};
