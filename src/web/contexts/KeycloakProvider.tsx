import Keycloak from 'keycloak-js';
import log from 'loglevel';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export interface KeycloakTokens {
  token?: string;
  idToken?: string;
  refreshToken?: string;
}

interface KeycloakContextValue {
  keycloak: Keycloak;
  initialized: boolean;
}

const KeycloakContext = createContext<KeycloakContextValue | undefined>(undefined);

interface KeycloakProviderProps {
  children: ReactNode;
  authClient: Keycloak;
  initOptions?: Keycloak.KeycloakInitOptions;
  onTokens?: (tokens: KeycloakTokens) => void;
}

export function KeycloakProvider({
  children,
  authClient,
  initOptions = {},
  onTokens,
}: KeycloakProviderProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    authClient
      .init(initOptions)
      .then((authenticated) => {
        setInitialized(true);

        if (authenticated && onTokens) {
          onTokens({
            token: authClient.token,
            idToken: authClient.idToken,
            refreshToken: authClient.refreshToken,
          });
        }

        // Set up token refresh
        if (authenticated) {
          // Update tokens every 5 seconds if needed
          const interval = setInterval(() => {
            authClient
              .updateToken(70)
              .then((refreshed) => {
                if (refreshed && onTokens) {
                  onTokens({
                    token: authClient.token,
                    idToken: authClient.idToken,
                    refreshToken: authClient.refreshToken,
                  });
                }
              })
              .catch(() => {
                // Token refresh failed, user needs to re-authenticate
                authClient.login();
              });
          }, 5000);

          return () => clearInterval(interval);
        }
      })
      .catch((error) => {
        log.error('Keycloak initialization failed', error);
        setInitialized(true);
      });
  }, [authClient, initOptions, onTokens]);

  const contextValue = useMemo(
    () => ({ keycloak: authClient, initialized }),
    [authClient, initialized]
  );

  return <KeycloakContext.Provider value={contextValue}>{children}</KeycloakContext.Provider>;
}

export function useKeycloak(): KeycloakContextValue {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error('useKeycloak must be used within a KeycloakProvider');
  }
  return context;
}
