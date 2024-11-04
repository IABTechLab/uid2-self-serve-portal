import config from '../../../../package.json';
import { ParticipantDTO } from '../../../api/entities/Participant';
import { UserAccount } from '../../services/userAccount';
import { compareVersions, shouldRemoveCurrentStep } from './tourHelpers';
import { tourSteps, VersionedTourStep } from './tourSteps';

const { version } = config;

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

export function GetTourSteps(
  loggedInUser: UserAccount | null,
  participant: ParticipantDTO | null,
  steps = tourSteps
): VersionedTourStep[] {
  // search seen steps for the highest version number
  const storedVersions = getTourData().seenForVersions;
  // if there are no seen version, this is the users first time in the portal
  // new features don't make sense to show in this case
  if (storedVersions.length === 0) {
    return [];
  }
  // Sort in reverse order - highest first
  storedVersions.sort((first, second) => compareVersions(second, first));
  const highestSeenVersion = storedVersions.length > 0 ? storedVersions[0] : '0.0.0';
  return steps.filter((step) => {
    if (shouldRemoveCurrentStep(step, loggedInUser, participant)) return;
    const stepVersionIsHigher = compareVersions(step?.version, highestSeenVersion) > 0;
    return stepVersionIsHigher;
  });
}
