import Joyride from 'react-joyride';

import config from '../../../../package.json';

const { version } = config;

export const TourSteps: React.ComponentProps<typeof Joyride>['steps'] = [
  {
    target: `.profile-dropdown-button`,
    content: `We've moved some menu items to your profile dropdown.`,
    disableBeacon: true,
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

export function ShouldShowTour() {
  const tourData = getTourData();
  return !tourData.seenForVersions.includes(version);
}

export function markTourAsSeen() {
  const tourData = getTourData();
  if (!tourData.seenForVersions.includes(version)) tourData.seenForVersions.push(version);
  saveTourData(tourData);
}
