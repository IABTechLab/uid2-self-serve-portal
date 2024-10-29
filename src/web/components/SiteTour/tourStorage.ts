import Joyride from 'react-joyride';

import config from '../../../../package.json';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { UserWithParticipantRoles } from '../../../api/services/usersService';
import { UserAccount } from '../../services/userAccount';
import { isUserOperations } from '../../utils/userRoleHelpers';

const { version } = config;

export type VersionedTourStep = React.ComponentProps<typeof Joyride>['steps'][number] & {
  version: string;
};
// Temporary solution: all tour steps without a version are treated as relevant to the current version.
// Update the version after release to avoid showing it again. We can automate this in the release pipeline.
export const tourSteps: VersionedTourStep[] = [
  {
    target: `.profile-dropdown-button`,
    content: `We've moved some menu items to your profile dropdown.`,
    disableBeacon: true,
    title: `New Menu Items`,
    version: '0.36.0',
  },
  {
    target: `.participant-switcher`,
    content: `You can now switch between participants that you have access to, and view or complete actions for the selected participant.`,
    disableBeacon: true,
    title: `Participant Switcher`,
    version: '0.48.0',
  },
  {
    target: `.profile-dropdown-button`,
    content: `Within this menu, we've added a new item, Audit Trail, where you can view details of all past actions for the selected participant.`,
    disableBeacon: true,
    title: 'Audit Trail',
    version: '0.48.0',
  },
];

type TourData = {
  seenForVersions: string[];
};
export const tourStorageKey = 'tour-data';

function isValidTourData(data: unknown | TourData): data is TourData {
  return (
    (data as TourData).seenForVersions !== undefined &&
    Array.isArray((data as TourData).seenForVersions)
  );
}

function getTourData(): TourData {
  const noData = { seenForVersions: [] };
  const unparsed = localStorage.getItem(tourStorageKey);
  if (!unparsed) return noData;
  const parsed = JSON.parse(unparsed) as unknown;
  if (!isValidTourData(parsed)) return noData;
  return parsed;
}
function saveTourData(data: TourData) {
  localStorage.setItem(tourStorageKey, JSON.stringify(data));
}

const shouldRemoveParticipantSwitcherStep = (user: UserWithParticipantRoles | null | undefined) => {
  return (user?.participants?.length ?? 0) <= 1;
};

const shouldRemoveAuditTrailStep = (
  user: UserWithParticipantRoles | null | undefined,
  participant: ParticipantDTO | null
) => {
  if (!user || !participant) {
    return true;
  }
  return isUserOperations(user, participant.id);
};

function shouldRemoveCurrentStep(
  step: VersionedTourStep,
  loggedInUser: UserAccount | null,
  participant: ParticipantDTO | null
) {
  if (step?.title === `Participant Switcher`) {
    return shouldRemoveParticipantSwitcherStep(loggedInUser?.user);
  }
  if (step?.title === 'Audit Trail') {
    return shouldRemoveAuditTrailStep(loggedInUser?.user, participant);
  }
  return false;
}

export function markTourAsSeen() {
  const tourData = getTourData();
  if (!tourData.seenForVersions.includes(version)) tourData.seenForVersions.push(version);
  saveTourData(tourData);
}

export const compareVersions = (a: string, b: string): number => {
  const parsedA = a.split('.').map((v) => parseInt(v, 10));
  const parsedB = b.split('.').map((v) => parseInt(v, 10));
  for (let versionPart = 0; versionPart < parsedA.length; versionPart++) {
    if (parsedA[versionPart] !== parsedB[versionPart])
      return parsedA[versionPart] - parsedB[versionPart];
  }
  return 0;
};

export function GetTourSteps(
  loggedInUser: UserAccount | null,
  participant: ParticipantDTO | null,
  steps = tourSteps
): VersionedTourStep[] {
  // search seen steps for the highest version number
  const storedVersions = getTourData().seenForVersions;
  // Sort in reverse order - highest first
  storedVersions.sort((first, second) => compareVersions(second, first));
  const highestSeenVersion = storedVersions.length > 0 ? storedVersions[0] : '0.0.0';
  return steps.filter((step) => {
    if (shouldRemoveCurrentStep(step, loggedInUser, participant)) return;
    const stepVersionIsHigher = compareVersions(step?.version, highestSeenVersion) > 0;
    return stepVersionIsHigher;
  });
}
