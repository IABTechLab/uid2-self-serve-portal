import axios from 'axios';

export const analyticsIdentifier = (errorId?: string, errorHash?: string) => {
  if (!errorHash && !errorId) return 'No error identifier';
  return errorHash
    ? `error hash: ${errorHash}` // From backend
    : `error ID: ${errorId}`; // Generated by frontend to make it possible to triage user reported errors.
};

export const extractMessageFromAxiosError = (err: Error) => {
  // message does not exist on the data field for Axios Error.Response, but we add it
  // in our API for custom messages
  let message = null;
  if (axios.isAxiosError(err)) {
    if (err.response?.data?.message) {
      message = err.response?.data?.message as string;
    } else if ((err.response?.data ?? [])[0]?.message) {
      message = err.response?.data[0]?.message as string;
    } else if (err.response?.data) {
      message = err.response?.data as string;
    }
  }
  return message;
};
