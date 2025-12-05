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

  const setupKeycloakHandlers = useCallback(() => {
    const keycloak = authClient;
    // Set up token refresh
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).then((refreshed) => {
        if (refreshed) {
          handleTokens();
        } else {
          setAuthenticated(false);
        }
      }).catch(() => {
        setAuthenticated(false);
      });
    };

    keycloak.onAuthSuccess = () => {
      setAuthenticated(true);
      handleTokens();
    };

    keycloak.onAuthError = () => {
      setAuthenticated(false);
    };

    keycloak.onAuthLogout = () => {
      setAuthenticated(false);
    };

    keycloak.onAuthRefreshError = () => {
      setAuthenticated(false);
    };
  }, [authClient, handleTokens]);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const auth = await authClient.init(initOptions);
        setAuthenticated(auth);
        setInitialized(true);

        if (auth) {
          handleTokens();
        }

        setupKeycloakHandlers();
      } catch (error) {
        setInitialized(true);
      }
    };

    initKeycloak();
  }, [authClient, initOptions, handleTokens, setupKeycloakHandlers]);

  // Session timeout detection
  useEffect(() => {
    if (!initialized || !authenticated) return;

    let checkCount = 0;

    const checkSessionValidity = async () => {
      checkCount++;

      // Every 30 seconds, check if token is still valid (every 10th check)
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
