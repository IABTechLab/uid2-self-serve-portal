import { ReactKeycloakProvider } from '@react-keycloak/web';
import { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { CurrentUserProvider } from '../web/contexts/CurrentUserProvider';
import keycloak from '../web/Keycloak';

export function TestContextProvider({ children }: PropsWithChildren) {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <CurrentUserProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </CurrentUserProvider>
    </ReactKeycloakProvider>
  );
}
