import { ReactKeycloakProvider } from '@react-keycloak/web';
import axios from 'axios';
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
root.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      checkLoginIframe: false,
    }}
  >
    <RouterProvider router={router} />
  </ReactKeycloakProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
