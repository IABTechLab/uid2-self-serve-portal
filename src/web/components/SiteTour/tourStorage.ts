import Joyride from 'react-joyride';

import config from '../../../../package.json';

const { version } = config;

type VersionedTourStep = React.ComponentProps<typeof Joyride>['steps'][number] & {
  version?: string;
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
const tourStorageKey = 'tour-data';

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

const compareVersions = (a: string | undefined, b: string): string => {
  const defaultVersion = '0.0.0';

  if (!a) {
    return defaultVersion;
  }

  const parsedA: string[] = a.split('.');
  const parsedB: string[] = b.split('.');

  if (Number(parsedA[0]) > Number(parsedB[0])) {
    return a;
  }
  if (Number(parsedB[0]) > Number(parsedA[0])) {
    return b;
  }
  if (Number(parsedA[1]) > Number(parsedB[1])) {
    return a;
  }
  if (Number(parsedB[1]) > Number(parsedA[1])) {
    return b;
  }
  if (Number(parsedA[2]) > Number(parsedB[2])) {
    return a;
  }
  if (Number(parsedB[2]) > Number(parsedA[2])) {
    return b;
  }
  return defaultVersion;
};

export function GetTourSteps(): VersionedTourStep[] {
  // search seen steps for the highest version number
  const storedVersions = getTourData().seenForVersions;
  let highestStoredVersion = '0.0.0';
  storedVersions.forEach((v) => {
    highestStoredVersion = compareVersions(highestStoredVersion, v);
  });
  // return steps with versions higher than the highest seen version
  return tourSteps.filter((step) => {
    return compareVersions(step?.version, highestStoredVersion) === step?.version;
  });
}
