import { useEffect, useState } from 'react';
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
}

// Component to handle token updates
function TokenHandler() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.user?.access_token) {
      setAuthToken(auth.user.access_token);
      revalidateIfLoaderError(router);
    }
  }, [auth.user?.access_token]);

  return null;
}

function Root() {
  const [oidcConfig, setOidcConfig] = useState<AuthProviderProps | null>(null);

  useEffect(() => {
    // Fetch Keycloak config from API
    fetch('/api/keycloak-config')
      .then((res) => res.json())
      .then((config: KeycloakConfig) => {
        const authServerUrl = config['auth-server-url'];
        const { realm } = config;
        const clientId = config.resource;

        setOidcConfig({
          authority: `${authServerUrl}/realms/${realm}`,
          client_id: clientId, // eslint-disable-line camelcase
          redirect_uri: window.location.origin, // eslint-disable-line camelcase
          post_logout_redirect_uri: window.location.origin, // eslint-disable-line camelcase
          automaticSilentRenew: true, // Automatically refresh tokens
          onSigninCallback: () => {
            // Remove OIDC params from URL after signin
            window.history.replaceState({}, document.title, window.location.pathname);
          },
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load Keycloak config:', error);
      });
  }, []);

  if (!oidcConfig) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider {...oidcConfig}>
      <TokenHandler />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
root.render(<Root />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
