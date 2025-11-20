import { useCallback } from 'react';
import { useAuth } from 'react-oidc-context';

import { ErrorView } from '../components/Core/ErrorView/ErrorView';
import { errorHandler, RenderedErrorProps } from './errorHandler';

import './PortalErrorBoundary.scss';

function PortalErrorComponent(props: Readonly<RenderedErrorProps>) {
  const { errorId, errorHash } = props;

  const auth = useAuth();
  const logout = useCallback(() => {
    auth.signoutRedirect();
  }, [auth]);

  return (
    <div className='portal-error-boundary'>
      <button className='logout-button' type='button' onClick={logout}>
        Log Out
      </button>
      <ErrorView errorId={errorId} errorHash={errorHash} />
    </div>
  );
}

export const PortalErrorBoundary = errorHandler(PortalErrorComponent);
