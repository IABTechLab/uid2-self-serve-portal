import { AxiosError } from 'axios';

import { ErrorToast } from '../components/Core/Toast';
/*
 * Backend errors may return an `errorHash` that can help correlate the logs
 * with the user reported issues.
 */
export class ApiError extends Error {
  errorHash?: string;
  statusCode?: number;
  constructor(message: string, opts: { errorHash?: string; statusCode?: number }) {
    super(message);
    this.errorHash = opts.errorHash;
    this.statusCode = opts.statusCode;
    this.name = 'ApiError';
  }
}

export function backendError(e: unknown, overrideMessage: string) {
  if (e instanceof AxiosError) {
    const hash = e.response?.data?.errorHash as string;

    return new ApiError(overrideMessage, {
      errorHash: hash,
      statusCode: e.status || e.response?.status,
    });
  }
  return Error(overrideMessage);
}

const isError = (obj: unknown): obj is Error => obj instanceof Error;

const getHash = (e: Error) => {
  let result = '';
  if (e instanceof ApiError) {
    result = e.errorHash ?? '';
  }
  if (e instanceof AxiosError) {
    result = (e.response?.data?.errorHash as string) ?? '';
  }
  return result;
};

export const handleErrorToast = (e: unknown) => {
  if (isError(e)) {
    const hash = getHash(e);
    const hashMessage = hash.length > 0 ? `: (${hash})` : '';
    ErrorToast(`${e.message}${hashMessage}`);
  }
  throw e;
};
