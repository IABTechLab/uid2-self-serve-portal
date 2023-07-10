import { QueryBuilder } from 'objection';

import { Participant } from '../entities/Participant';
import { User } from '../entities/User';

export const mockParticipant = (participant: Partial<Participant> | null = {}) => {
  jest.spyOn(Participant, 'query').mockReturnValueOnce(
    QueryBuilder.forClass(Participant).resolve(
      participant === null
        ? undefined
        : {
            id: '1',
            name: 'Test Participant',
            location: 'Test Location',
            allowSharing: true,
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
              id: '1',
              email: 'test_user@example.com',
              name: 'Test User',
              participantId: 1,
              ...u,
            }
      )
    )
  );
};
