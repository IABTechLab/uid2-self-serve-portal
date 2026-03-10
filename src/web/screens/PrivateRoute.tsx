import { useKeycloak } from '../contexts/KeycloakProvider';

type PrivateRouteProps = {
  children: JSX.Element;
};
export function PrivateRoute({ children }: PrivateRouteProps) {
  const { keycloak, authenticated } = useKeycloak();

  if (!authenticated && keycloak) {
    const redirectUri = window.location.origin + window.location.pathname + window.location.search;
    const idpHint = new URLSearchParams(window.location.search).get('kc_idp_hint') ?? undefined;
    // Use createLoginUrl + redirect so kc_idp_hint is always in the auth URL (login() can drop it in some adapter versions).
    Promise.resolve(keycloak.createLoginUrl({ redirectUri, idpHint })).then((url) => {
      window.location.assign(url);
    });
    return null;
  }

  return children;
}
