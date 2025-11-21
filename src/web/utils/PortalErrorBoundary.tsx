import { useCallback } from 'react';

import { ErrorView } from '../components/Core/ErrorView/ErrorView';
import { useKeycloak } from '../contexts/KeycloakProvider';
import { errorHandler, RenderedErrorProps } from './errorHandler';

import './PortalErrorBoundary.scss';

function PortalErrorComponent(props: Readonly<RenderedErrorProps>) {
  const { errorId, errorHash } = props;

  const { keycloak } = useKeycloak();
  const logout = useCallback(() => {
    keycloak?.logout();
  }, [keycloak]);

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
