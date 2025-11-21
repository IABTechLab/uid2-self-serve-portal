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
            } else {
              setAuthenticated(false);
            }
          }).catch(() => {
            setAuthenticated(false);
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

        // Handle refresh token expiry (session timeout)
        // eslint-disable-next-line no-param-reassign
        authClient.onAuthRefreshError = () => {
          setAuthenticated(false);
        };
      } catch (error) {
        setInitialized(true);
      }
    };

    initKeycloak();
  }, [authClient, initOptions, handleTokens]);

  // Session timeout detection
  useEffect(() => {
    if (!initialized || !authenticated) return;

    let checkCount = 0;

    const checkSessionValidity = async () => {
      checkCount++;

      // Every 10th check (every 30 seconds), test with a lightweight API call
      if (checkCount % 10 === 0 && authClient.token) {
        try {
          const response = await fetch('/api/keycloak-config', {
            method: 'HEAD',
            headers: {
              'Authorization': `Bearer ${authClient.token}`,
            },
          });

          if (response.status === 401 || response.status === 403) {
            setAuthenticated(false);
            return;
          }
        } catch (error) {
          setAuthenticated(false);
          return;
        }
      }

      // Sync React state with Keycloak state
      const keycloakAuth = authClient.authenticated || false;
      if (keycloakAuth !== authenticated) {
        setAuthenticated(keycloakAuth);
      }
    };

    const interval = setInterval(checkSessionValidity, 3000);

    return () => clearInterval(interval);
  }, [authClient, initialized, authenticated]);

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
