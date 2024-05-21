import axios from 'axios';
import { useAsyncError } from 'react-router-dom';

import { ApiError, getErrorHash } from '../../utils/apiError';
import { analyticsIdentifier, extractMessageFromAxiosError } from '../../utils/errorHelpers';

type ErrorViewProps = {
  message?: string;
  errorId?: string;
  errorHash?: string;
};

export function ErrorView({ message, errorId, errorHash }: ErrorViewProps) {
  return (
    <div className='error-content'>
      <img alt='Error icon' src='/uid2-logo.png' />
      <div>There was an unexpected error. Please try again.</div>
      <div>If the problem persists, contact Support and provide the following information:</div>
      {!!message && <div>Error message: {message}</div>}
      <div>({analyticsIdentifier(errorId, errorHash)})</div>
    </div>
  );
}

export function AsyncErrorView() {
  const err = useAsyncError();
  if (axios.isAxiosError(err)) {
    const message = extractMessageFromAxiosError(err);
    const hash = getErrorHash(err);
    return <ErrorView errorHash={hash} message={message} />;
  }
  if (err instanceof ApiError) {
    return <ErrorView errorHash={err.errorHash} message={err.message} />;
  }
  return <ErrorView />;
}
