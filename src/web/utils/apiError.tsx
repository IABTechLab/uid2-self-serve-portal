import { AxiosError } from 'axios';

import { StatusNotificationType } from '../components/Core/StatusPopup';
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

export function handleErrorPopup(
  e: Error,
  setStatusPopup: React.Dispatch<React.SetStateAction<StatusNotificationType | undefined>>,
  setShowStatusPopup: React.Dispatch<React.SetStateAction<boolean>>
) {
  const hasHash = Object.hasOwn(e, 'errorHash') && (e as ApiError).errorHash;
  const hash = hasHash ? `: (${(e as ApiError).errorHash})` : '';
  setStatusPopup({
    type: 'Error',
    message: `${e.message}${hash}`,
  });
  setShowStatusPopup(true);
  throw new Error(e.message);
}
