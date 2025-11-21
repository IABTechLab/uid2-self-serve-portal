import { useKeycloak } from '@react-keycloak/web';
import type Keycloak from 'keycloak-js';

type PrivateRouteProps = {
  children: JSX.Element;
};
export function PrivateRoute({ children }: PrivateRouteProps) {
  const { keycloak } = useKeycloak() as { keycloak: Keycloak; initialized: boolean };

  if (!keycloak?.authenticated) {
    keycloak?.login({ redirectUri: window.location.origin });
  }

  return keycloak?.authenticated ? children : null;
}
