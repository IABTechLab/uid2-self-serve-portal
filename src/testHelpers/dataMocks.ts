import { faker } from '@faker-js/faker';

import { Participant, ParticipantDTO, ParticipantStatus } from '../api/entities/Participant';
import { UserJobFunction } from '../api/entities/User';
import { UserWithIsUid2Support } from '../api/services/usersService';

export const createMockUser = (participants: Participant[]): UserWithIsUid2Support => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const generatedEmail = faker.internet.email({
    firstName,
    lastName,
  });

  const user = {
    id: faker.number.int(),
    firstName,
    lastName,
    email: generatedEmail,
    jobFunction: faker.helpers.arrayElement(Object.values(UserJobFunction)),
    acceptedTerms: true,
    isUid2Support: faker.datatype.boolean(),
    participants,
  };

  return user;
};

export const createMockParticipant = (): ParticipantDTO => ({
  id: faker.number.int(),
  name: faker.company.name(),
  status: ParticipantStatus.Approved,
  allowSharing: true,
  completedRecommendations: faker.datatype.boolean(),
  crmAgreementNumber: '12345678',
});
