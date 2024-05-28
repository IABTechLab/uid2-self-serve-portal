import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';

export const yearInSeconds = 60 * 60 * 24 * 365.25;

// api key is recommended to rotate if older than one year
export const shouldRotateApiKey = (apiKey: ApiKeyDTO): boolean => {
  // apiKey date is in seconds, current date is in milliseconds
  const currentDate = Math.floor(Date.now() / 1000);
  if (currentDate - apiKey.created > yearInSeconds) {
    return true;
  }
  return false;
};
