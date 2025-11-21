import type Keycloak from 'keycloak-js';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface AuthClientTokens {
  token?: string;
  refreshToken?: string;
  idToken?: string;
}

export interface KeycloakContextValue {
  keycloak: Keycloak;
  initialized: boolean;
  authenticated: boolean;
}

const KeycloakContext = createContext<KeycloakContextValue | undefined>(undefined);

export interface KeycloakProviderProps {
  children: ReactNode;
  authClient: Keycloak;
  initOptions?: Keycloak.KeycloakInitOptions;
  onTokens?: (tokens: AuthClientTokens) => void;
}

export function KeycloakProvider({
  children,
  authClient,
  initOptions = {},
  onTokens
}: KeycloakProviderProps) {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleTokens = useCallback(() => {
    if (onTokens) {
      onTokens({
        token: authClient.token,
        refreshToken: authClient.refreshToken,
        idToken: authClient.idToken,
      });
    }
  }, [authClient, onTokens]);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const auth = await authClient.init(initOptions);
        setAuthenticated(auth);
        setInitialized(true);

        if (auth) {
          handleTokens();
        }

        // Set up token refresh
        // eslint-disable-next-line no-param-reassign
        authClient.onTokenExpired = () => {
          authClient.updateToken(30).then((refreshed) => {
            if (refreshed) {
              handleTokens();
            }
          }).catch(() => {
            // eslint-disable-next-line no-console
            console.warn('Failed to refresh token');
          });
        };

        // Handle authentication events
        // eslint-disable-next-line no-param-reassign
        authClient.onAuthSuccess = () => {
          setAuthenticated(true);
          handleTokens();
        };

        // eslint-disable-next-line no-param-reassign
        authClient.onAuthError = () => {
          setAuthenticated(false);
        };

        // eslint-disable-next-line no-param-reassign
        authClient.onAuthLogout = () => {
          setAuthenticated(false);
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Keycloak initialization failed:', error);
        setInitialized(true);
      }
    };

    initKeycloak();
  }, [authClient, initOptions, handleTokens]);

  const contextValue: KeycloakContextValue = useMemo(() => ({
    keycloak: authClient,
    initialized,
    authenticated,
  }), [authClient, initialized, authenticated]);

  return (
    <KeycloakContext.Provider value={contextValue}>
      {children}
    </KeycloakContext.Provider>
  );
}

export function useKeycloak(): KeycloakContextValue {
  const context = useContext(KeycloakContext);
  if (context === undefined) {
    throw new Error('useKeycloak must be used within a KeycloakProvider');
  }
  return context;
}
