import Joyride from 'react-joyride';

import config from '../../../../package.json';

const { version } = config;

export type VersionedTourStep = React.ComponentProps<typeof Joyride>['steps'][number] & {
  version: string;
};
// Temporary solution: all tour steps without a version are treated as relevant to the current version.
// Update the version after release to avoid showing it again. We can automate this in the release pipeline.
const tourSteps: VersionedTourStep[] = [
  {
    target: `.profile-dropdown-button`,
    content: `We've moved some menu items to your profile dropdown.`,
    disableBeacon: true,
    version: '0.36.0',
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

export function GetTourSteps(steps = tourSteps): VersionedTourStep[] {
  // search seen steps for the highest version number
  const storedVersions = getTourData().seenForVersions;
  // Sort in reverse order - highest first
  storedVersions.sort((first, second) => compareVersions(second, first));
  const highestSeenVersion = storedVersions.length > 0 ? storedVersions[0] : '0.0.0';
  return steps.filter((step) => {
    const stepVersionIsHigher = compareVersions(step?.version, highestSeenVersion) > 0;
    return stepVersionIsHigher;
  });
}
