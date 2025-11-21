import { useKeycloak } from '@react-keycloak/web';

type PrivateRouteProps = {
  children: JSX.Element;
};
export function PrivateRoute({ children }: PrivateRouteProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { keycloak } = useKeycloak();

  if (!keycloak?.authenticated) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    keycloak?.login({ redirectUri: window.location.origin });
  }

  return keycloak?.authenticated ? children : null;
}
