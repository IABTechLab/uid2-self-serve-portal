import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';

const yearInSeconds = 60 * 60 * 24 * 365.25;

export const shouldRotateApiKey = (apiKey: ApiKeyDTO): boolean => {
  const currentDate = new Date().getTime();
  // apiKey date is in seconds, current date is in milliseconds
  const currentDateFormat = Math.floor(currentDate / 1000);
  if (currentDateFormat - apiKey.created > yearInSeconds) {
    return true;
  }
  return false;
};
