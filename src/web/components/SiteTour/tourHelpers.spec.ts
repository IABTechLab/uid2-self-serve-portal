import { Participant } from '../../../api/entities/Participant';
import { UserRoleId } from '../../../api/entities/UserRole';
import { createMockParticipant, createMockUser } from '../../../testHelpers/dataMocks';
import { createUserContextValue } from '../../../testHelpers/testContextProvider';
import { compareVersions } from './tourHelpers';
import { tourSteps } from './tourSteps';
import { GetTourSteps, tourStorageKey } from './tourStorage';

describe('testing tour storage helper functions', () => {
  const mockParticipant = createMockParticipant();
  const mockParticipant2 = createMockParticipant();
  const mockUser = createMockUser([mockParticipant] as Participant[]);
  const mockLoggedInUser = createUserContextValue(mockUser).LoggedInUser;

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

  test('all steps returned for those with the correct user roles and multiple participants', () => {
    mockUser.isUid2Support = false;
    mockUser.currentParticipantUserRoles = [{ id: UserRoleId.Admin, roleName: 'Admin' }];
    mockUser.participants = [mockParticipant, mockParticipant2] as Participant[];
    mockParticipant.currentUserRoleIds = [UserRoleId.Admin];
    localStorage.setItem(tourStorageKey, JSON.stringify({ seenForVersions: ['0.1.0'] }));

    const steps = GetTourSteps(mockLoggedInUser, mockParticipant);

    expect(steps).toEqual(tourSteps);
  });

  test('audit trail step is filtered out for those without the correct user roles', () => {
    mockUser.isUid2Support = false;
    mockUser.currentParticipantUserRoles = [{ id: UserRoleId.Operations, roleName: 'Operations' }];
    mockParticipant.currentUserRoleIds = [UserRoleId.Operations];

    const steps = GetTourSteps(mockLoggedInUser, mockParticipant);

    expect(steps).not.toContainEqual(tourSteps.find((step) => step.title === 'Audit Trail'));
  });

  test('participant switcher step is filtered out for a user with only one participant', () => {
    mockUser.isUid2Support = false;
    mockUser.participants = [mockParticipant as Participant];
    mockUser.currentParticipantUserRoles = [{ id: UserRoleId.Operations, roleName: 'Admin' }];

    const steps = GetTourSteps(mockLoggedInUser, mockParticipant);

    expect(steps).not.toContainEqual(
      tourSteps.find((step) => step.title === 'Participant Switcher')
    );
  });
});
