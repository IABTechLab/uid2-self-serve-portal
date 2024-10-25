import { Participant } from '../../../api/entities/Participant';
import { createMockParticipant, createMockUser } from '../../../testHelpers/dataMocks';
import { createUserContextValue } from '../../../testHelpers/testContextProvider';
import { compareVersions, GetTourSteps, tourStorageKey, VersionedTourStep } from './tourStorage';

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
  test('Compare Versions sorts in correct order', () => {
    const data = ['1', '2', '7', '13', '0', '7', '102', '53', '5'];
    const majors = [...data];
    const majorAndMinor = majors.flatMap((maj) => data.map((min) => `${maj}.${min}`));
    const versions = majorAndMinor.flatMap((mm) => data.map((patch) => `${mm}.${patch}`));
    expect(versions).toContainEqual('7.2.13');
    versions.sort(() => Math.random());
    versions.sort(compareVersions);
    expect(versions[0]).toBe('0.0.0');
    expect(versions.slice(-1)[0]).toBe('102.102.102');
  });
});
