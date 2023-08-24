import { useKeycloak } from '@react-keycloak/web';

import { PortalRoute } from './routeUtils';

import './home.scss';

function Logout() {
  const { keycloak } = useKeycloak();
  keycloak?.logout();
  return <h1>Logging out...</h1>;
}
export const LogoutRoute: PortalRoute = {
  path: '/Logout',
  description: 'Logout',
  element: <Logout />,
};
