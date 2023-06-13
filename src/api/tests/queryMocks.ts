import { QueryBuilder } from 'objection';

import { Participant } from '../entities/Participant';
import { User } from '../entities/User';

export const mockParticipant = (participant: Partial<Participant> = {}) => {
  jest.spyOn(Participant, 'query').mockReturnValueOnce(
    QueryBuilder.forClass(Participant).resolve({
      id: '1',
      name: 'Test Participant',
      location: 'Test Location',
      allowSharing: true,
      ...participant,
    })
  );
};

export const mockUser = (user: Partial<User> | Partial<User>[] = {}) => {
  const users = Array.isArray(user) ? user : [user];
  const spy = jest.spyOn(User, 'query');
  users.forEach((u) =>
    spy.mockReturnValueOnce(
      QueryBuilder.forClass(User).resolve({
        id: '1',
        email: 'test_user@example.com',
        name: 'Test User',
        participantId: 1,
        ...u,
      })
    )
  );
};
