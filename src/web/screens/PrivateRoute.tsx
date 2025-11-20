import { useKeycloak } from '@react-keycloak/web';

type PrivateRouteProps = {
  children: JSX.Element;
};
export function PrivateRoute({ children }: PrivateRouteProps) {
  const { keycloak } = useKeycloak();

  if (!keycloak?.authenticated) {
    keycloak?.login({ redirectUri: window.location.origin });
  }

  return keycloak?.authenticated ? children : null;
}
