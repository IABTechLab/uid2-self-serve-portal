import { AuthClientTokens } from '@react-keycloak/core';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import axios from 'axios';
import { useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { App } from './web/App';
import keycloak from './web/Keycloak';
import { reportWebVitals } from './web/reportWebVitals';
import { Routes } from './web/screens/routes';

import './web/index.scss';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: Routes,
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

function Root() {
  const onUpdateToken = useCallback((tokens: AuthClientTokens) => {
    let requestInterceptor;
    if (tokens.token) {
      requestInterceptor = axios.interceptors.request.use((config) => {
        // Attach current access token ref value to outgoing request headers
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = tokens ? `Bearer ${tokens.token}` : undefined;
        return config;
      });
    } else if (requestInterceptor) {
      axios.interceptors.request.eject(requestInterceptor);
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
