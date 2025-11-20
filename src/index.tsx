import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider, AuthProviderProps, useAuth } from 'react-oidc-context';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { App } from './web/App';
import { setAuthToken } from './web/axios';
import { CurrentUserProvider } from './web/contexts/CurrentUserProvider';
import { initializeFaro } from './web/initializeFaro';
import { configureLogging } from './web/logging';
import { reportWebVitals } from './web/reportWebVitals';
import { Routes } from './web/screens/routes';
import { revalidateIfLoaderError } from './web/utils/erroredRouteHelper';
import { PortalErrorBoundary } from './web/utils/PortalErrorBoundary';

import './web/index.scss';

configureLogging();
initializeFaro();
const router = createBrowserRouter([
  {
    // Re-direct legacy routes
    path: '/dashboard/*',
    element: <Navigate to='/' replace />,
  },
  {
    element: (
      <PortalErrorBoundary>
        <CurrentUserProvider>
          <App />
        </CurrentUserProvider>
      </PortalErrorBoundary>
    ),
    children: Routes,
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

interface KeycloakConfig {
  realm: string;
  'auth-server-url': string;
  resource: string;
  'sso-session-idle-timeout-minutes'?: number;
}

// Component to handle token updates only
function TokenHandler() {
  const auth = useAuth();
  const previousToken = useRef<string | undefined>(undefined);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const token = auth.user?.access_token;

    // Skip if no token
    if (!token) return;

    // Check if token string value actually changed
    if (token === previousToken.current) {
      return; // Same token, do nothing
    }

    setAuthToken(token);

    // Only revalidate on first token (initial login), not on every refresh
    if (!hasInitialized.current) {
      revalidateIfLoaderError(router);
      hasInitialized.current = true;
    }

    previousToken.current = token;
  }, [auth.user?.access_token]);

  return null;
}

// Separate component for idle timeout tracking
function IdleTimeoutTracker({ idleTimeoutMinutes }: { idleTimeoutMinutes: number }) {
  const auth = useAuth();
  const lastActivityTime = useRef(Date.now());
  const idleTimeoutMs = useMemo(() => idleTimeoutMinutes * 60 * 1000, [idleTimeoutMinutes]);
  const signoutRef = useRef(auth.signoutRedirect);
  const removeUserRef = useRef(auth.removeUser);

  // Update refs when they change
  useEffect(() => {
    signoutRef.current = auth.signoutRedirect;
    removeUserRef.current = auth.removeUser;
  }, [auth.signoutRedirect, auth.removeUser]);

  useEffect(() => {
    if (!auth.isAuthenticated) return undefined;

    // Track user activity
    const updateActivity = () => {
      lastActivityTime.current = Date.now();
    };

    // Listen for user activity events
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check for idle timeout and token refresh every 30 seconds
    const intervalId = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityTime.current;

      // If user is active (< 30s since last activity), try to refresh token silently
      if (timeSinceActivity < 30000) {
        // User is active, refresh token if needed
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, prefer-destructuring
        const userManager = (auth as any).userManager;
        if (userManager && auth.user) {
          const expiresIn = (auth.user.expires_at || 0) - Math.floor(Date.now() / 1000);
          if (expiresIn < 300) { // Less than 5 minutes until expiry
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            userManager.signinSilent().catch(() => {
              // Silent refresh failed, will be handled by next check
            });
          }
        }
      }

      if (timeSinceActivity >= idleTimeoutMs) {
        // User has been idle too long, force logout
        clearInterval(intervalId); // Stop checking

        // Force logout and redirect
        try {
          // Remove user from local storage
          removeUserRef.current();

          // Force redirect to login
          window.location.href = '/';
        } catch (error) {
          // Fallback: force page reload to login
          window.location.href = '/';
        }
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(intervalId);
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated, idleTimeoutMs]);

  return null;
}

function Root() {
  const [configData, setConfigData] = useState<{
    authority: string;
    clientId: string;
    idleTimeoutMinutes: number;
  } | null>(null);

  useEffect(() => {
    // Fetch Keycloak config from API
    fetch('/api/keycloak-config')
      .then((res) => res.json())
      .then((config: KeycloakConfig) => {
        const authServerUrl = config['auth-server-url'];
        const { realm } = config;
        const clientId = config.resource;
        const sessionIdleTimeout = config['sso-session-idle-timeout-minutes'] || 30; // Default 30 minutes

        setConfigData({
          authority: `${authServerUrl}/realms/${realm}`,
          clientId,
          idleTimeoutMinutes: sessionIdleTimeout,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load Keycloak config:', error);
      });
  }, []);

  const onSigninCallback = useCallback(() => {
    // Remove OIDC params from URL after signin
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  const oidcConfig = useMemo<AuthProviderProps | null>(() => {
    if (!configData) return null;

    return {
      authority: configData.authority,
      client_id: configData.clientId, // eslint-disable-line camelcase
      redirect_uri: window.location.origin, // eslint-disable-line camelcase
      post_logout_redirect_uri: window.location.origin, // eslint-disable-line camelcase
      automaticSilentRenew: false, // Manual refresh based on activity
      onSigninCallback,
    };
  }, [configData, onSigninCallback]);

  if (!oidcConfig) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider {...oidcConfig}>
      <TokenHandler />
      <IdleTimeoutTracker idleTimeoutMinutes={configData?.idleTimeoutMinutes || 30} />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
root.render(<Root />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
