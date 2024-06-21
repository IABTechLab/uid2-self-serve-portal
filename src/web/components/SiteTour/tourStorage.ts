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

export function GetTourSteps(): VersionedTourStep[] {
  return tourSteps.filter(
    (step) => !getTourData().seenForVersions.includes(step.version ?? version)
  );
}
