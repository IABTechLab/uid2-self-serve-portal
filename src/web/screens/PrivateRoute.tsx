import { useKeycloak } from '../contexts/KeycloakProvider';

type PrivateRouteProps = {
  children: JSX.Element;
};
export function PrivateRoute({ children }: PrivateRouteProps) {
  const { keycloak, authenticated } = useKeycloak();

  if (!authenticated) {
    keycloak?.login({ redirectUri: window.location.origin });
  }

  return authenticated ? children : null;
}
