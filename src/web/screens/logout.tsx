import { useKeycloak } from '../contexts/KeycloakProvider';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { PortalRoute } from './routeUtils';

import './home.scss';

function Logout() {
  const { keycloak } = useKeycloak();
  // Send the browser to the site root after logout. With no redirectUri, keycloak-js defaults
  // the post-logout redirect to the current URL, so once the Keycloak server tears down the
  // session it sends the browser back to /logout — now unauthenticated — where PrivateRoute
  // redirects it to log into its current path. Invitees whose invite email redirects here
  // then get trapped bouncing between login and /logout (UID2-7444). The origin lets them log
  // in fresh, preserving the UID2-1579 session-teardown intent.
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
