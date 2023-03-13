import { ReactKeycloakProvider } from '@react-keycloak/web';
import { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';

import keycloak from '../web/Keycloak';

export function TestContextProvider({ children }: PropsWithChildren) {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        checkLoginIframe: false,
      }}
    >
      <BrowserRouter>{children}</BrowserRouter>;
    </ReactKeycloakProvider>
  );
}
