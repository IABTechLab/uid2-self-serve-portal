import { QueryBuilder } from 'objection';

import { Approver } from '../entities/Approver';
import { BusinessContact, ContactType } from '../entities/BusinessContact';
import { Participant } from '../entities/Participant';
import { User } from '../entities/User';

export const mockParticipant = (participant: Partial<Participant> | null = {}) => {
  jest.spyOn(Participant, 'query').mockReturnValue(
    QueryBuilder.forClass(Participant).resolve(
      participant === null
        ? undefined
        : {
            id: 1,
            name: 'Test Participant',
            location: 'Test Location',
            allowSharing: true,
            types: [
              {
                id: 1,
                typeName: 'DSP',
              },
            ],
            ...participant,
          }
    )
  );
};

type PartialUserOrNull = Partial<User> | null;
export const mockUser = (user: PartialUserOrNull | PartialUserOrNull[] = {}) => {
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
              participantId: 1,
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
