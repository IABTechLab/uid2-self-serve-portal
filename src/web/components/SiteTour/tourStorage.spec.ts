import { Participant } from '../../../api/entities/Participant';
import { createMockParticipant, createMockUser } from '../../../testHelpers/dataMocks';
import { createUserContextValue } from '../../../testHelpers/testContextProvider';
import { VersionedTourStep } from './tourSteps';
import { GetTourSteps, tourStorageKey } from './tourStorage';

const mockTourData: VersionedTourStep[] = [
  {
    target: `.test-class`,
    content: `Test tour.`,
    disableBeacon: true,
    version: '0.36.0',
  },
];

const mockParticipant = createMockParticipant();
const mockUser = createMockUser([mockParticipant] as Participant[]);
const mockLoggedInUser = createUserContextValue(mockUser).LoggedInUser;

describe('Tour tests', () => {
  test('When the last tour seen is lower than a tour, it is included.', () => {
    localStorage.setItem(
      tourStorageKey,
      JSON.stringify({
        seenForVersions: ['0.35.0'],
      })
    );
    const steps = GetTourSteps(mockLoggedInUser, mockParticipant, mockTourData);
    expect(steps).toContainEqual(mockTourData[0]);
  });
  test('When the last tour seen is the same as a tour, it is excluded.', () => {
    localStorage.setItem(
      tourStorageKey,
      JSON.stringify({
        seenForVersions: ['0.35.0', '0.36.0'],
      })
    );
    const steps = GetTourSteps(mockLoggedInUser, mockParticipant, mockTourData);
    expect(steps).not.toContainEqual(mockTourData[0]);
  });
  test('When the last tour seen is higher than a tour, it is excluded.', () => {
    localStorage.setItem(
      tourStorageKey,
      JSON.stringify({
        seenForVersions: ['0.37.0', '0.35.0', '0.36.0'],
      })
    );
    const steps = GetTourSteps(mockLoggedInUser, mockParticipant, mockTourData);
    expect(steps).not.toContainEqual(mockTourData[0]);
  });
  test('When a tour was skipped (i.e. lower than highest seen but not in seen list), it is excluded.', () => {
    localStorage.setItem(
      tourStorageKey,
      JSON.stringify({
        seenForVersions: ['0.37.0', '0.35.0'],
      })
    );
    const steps = GetTourSteps(mockLoggedInUser, mockParticipant, mockTourData);
    expect(steps).not.toContainEqual(mockTourData[0]);
  });
  test('When user is logging in for the first time, no steps are returned', () => {
    localStorage.removeItem(tourStorageKey);
    const steps = GetTourSteps(mockLoggedInUser, mockParticipant, mockTourData);
    expect(steps).toHaveLength(0);
  });
});
