import { useKeycloak } from '@react-keycloak/web';
import type Keycloak from 'keycloak-js';

import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './home.scss';

function Logout() {
  const { keycloak } = useKeycloak() as { keycloak: Keycloak; initialized: boolean };
  keycloak?.logout();
  return <h1>Logging out...</h1>;
}
export const LogoutRoute: PortalRoute = {
  path: '/logout',
  description: 'Logout',
  element: <Logout />,
  errorElement: <RouteErrorBoundary />,
  isHidden: true,
};
