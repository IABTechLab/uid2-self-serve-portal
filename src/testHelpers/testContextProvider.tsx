import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';
import { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';

export const createTestKeycloakInstance = () => {
  return new Keycloak('/api/keycloak-config');
};

export function TestContextProvider({ children }: PropsWithChildren) {
  return (
    <ReactKeycloakProvider authClient={createTestKeycloakInstance()}>
      <BrowserRouter>{children}</BrowserRouter>
    </ReactKeycloakProvider>
  );
}
