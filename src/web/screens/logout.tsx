import { useKeycloak } from '../contexts/KeycloakProvider';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './home.scss';

function Logout() {
  const { keycloak } = useKeycloak();
  // Send the browser to the site root after logout. Without an explicit redirectUri,
  // Keycloak returns to the current URL (/logout); since PrivateRoute re-logs the user
  // into their current path, that produces an infinite login⇄logout loop for invitees
  // whose invite email redirects here (UID2-7444). '/' lets them log in fresh, preserving
  // the UID2-1579 session-teardown intent.
  keycloak?.logout({ redirectUri: window.location.origin });
  return <h1>Logging out...</h1>;
}
export const LogoutRoute: PortalRoute = {
  path: '/logout',
  description: 'Logout',
  element: <Logout />,
  errorElement: <RouteErrorBoundary />,
  isHidden: true,
};
