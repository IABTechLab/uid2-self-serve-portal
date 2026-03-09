import { useKeycloak } from '../contexts/KeycloakProvider';

type PrivateRouteProps = {
  children: JSX.Element;
};
export function PrivateRoute({ children }: PrivateRouteProps) {
  const { keycloak, authenticated } = useKeycloak();

  if (!authenticated) {
    const redirectUri = window.location.origin + window.location.pathname + window.location.search;
    const idpHint = new URLSearchParams(window.location.search).get('kc_idp_hint') ?? undefined;
    keycloak?.login({ redirectUri, idpHint });
  }

  return authenticated ? children : null;
}
