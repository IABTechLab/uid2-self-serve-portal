import { AuthClientTokens } from '@react-keycloak/core';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import log from 'loglevel';
import { useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { App } from './web/App';
import { setAuthToken } from './web/axios';
import { CurrentUserProvider } from './web/contexts/CurrentUserProvider';
import { initializeFaro } from './web/initializeFaro';
import keycloak from './web/Keycloak';
import { configureLogging } from './web/logging';
import { reportWebVitals } from './web/reportWebVitals';
import { Routes } from './web/screens/routes';
import { PortalErrorBoundary } from './web/utils/PortalErrorBoundary';

import './web/index.scss';

configureLogging();
initializeFaro();
const router = createBrowserRouter([
  {
    path: '/',
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

function revalidateIfLoaderError(routeObj: ReturnType<typeof createBrowserRouter>) {
  /*
    Caution: routeObj.state is marked as internal. This may be unstable!
    But I checked git and it hasn't changed in years:
    https://github.com/remix-run/react-router/blame/5d66dbdbc8edf1d9c3a4d9c9d84073d046b5785b/packages/router/router.ts#L84
    If it does change, we'll need to find another way to find out globally if there's a route loader error.
  */
  const { loaderData } = routeObj.state;
  let hasRevalidated = false;
  Object.entries(loaderData).forEach((kvp) => {
    const loaderReturnValue = kvp[1] as unknown;
    if (!loaderReturnValue) return;
    if (typeof loaderReturnValue !== 'object') return;

    const entries = Object.values(loaderReturnValue);
    entries.forEach((entry: unknown) => {
      if (!(entry instanceof Promise)) return;
      entry.catch((_err) => {
        if (hasRevalidated) return;
        log.info('Revalidating due to new token and errored route');
        hasRevalidated = true;
        router.revalidate();
      });
    });
  });
}

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
