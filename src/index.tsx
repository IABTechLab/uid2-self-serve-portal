import { AuthClientTokens } from '@react-keycloak/core';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { App } from './web/App';
import { setAuthToken } from './web/axios';
import { CurrentUserProvider } from './web/contexts/CurrentUserProvider';
import { initializeFaro } from './web/initializeFaro';
import keycloak from './web/Keycloak';
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

function Root() {
  const onUpdateToken = useCallback((tokens: AuthClientTokens) => {
    if (tokens.token) {
      setAuthToken(tokens.token);
      revalidateIfLoaderError(router);
    }
  }, []);

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        checkLoginIframe: false,
      }}
      onTokens={onUpdateToken}
    >
      <RouterProvider router={router} />
    </ReactKeycloakProvider>
  );
}
root.render(<Root />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
