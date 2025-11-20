import Keycloak from 'keycloak-js';
import log from 'loglevel';
import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

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

function getTokensFromKeycloak(keycloak: Keycloak): KeycloakTokens {
  return {
    token: keycloak.token,
    idToken: keycloak.idToken,
    refreshToken: keycloak.refreshToken,
  };
}

export function KeycloakProvider({
  children,
  authClient,
  initOptions = {},
  onTokens,
}: KeycloakProviderProps) {
  const [initialized, setInitialized] = useState(false);
  const refreshFailureCount = useRef(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    authClient
      .init(initOptions)
      .then((authenticated) => {
        setInitialized(true);

        if (authenticated) {
          // Send initial tokens
          if (onTokens) {
            onTokens(getTokensFromKeycloak(authClient));
          }

          // Automatic token refresh: check every 5s, refresh if expiring in < 30s
          intervalId = setInterval(() => {
            authClient
              .updateToken(30)
              .then((refreshed) => {
                if (refreshed && onTokens) {
                  onTokens(getTokensFromKeycloak(authClient));
                }
                refreshFailureCount.current = 0; // Reset failure count on success
              })
              .catch((error) => {
                refreshFailureCount.current += 1;
                log.warn('Token refresh failed', error);

                // Only force re-login after multiple failures
                if (refreshFailureCount.current >= 3) {
                  log.error('Multiple token refresh failures, forcing re-authentication');
                  authClient.login();
                }
              });
          }, 5000);
        }
      })
      .catch((error) => {
        log.error('Keycloak initialization failed', error);
        setInitialized(true);
      });

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
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
