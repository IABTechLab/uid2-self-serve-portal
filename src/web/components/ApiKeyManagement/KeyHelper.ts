import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';

export const yearInSeconds = 60 * 60 * 24 * 365.25;

export const shouldRotateApiKey = (apiKey: ApiKeyDTO): boolean => {
  if (apiKey.disabled === true) {
    return false;
  }
  // apiKey date is in seconds, current date is in milliseconds
  const currentDate = Math.floor(Date.now() / 1000);
  if (currentDate - apiKey.created > yearInSeconds) {
    return true;
  }
  return false;
};
