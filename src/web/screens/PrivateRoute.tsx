import { useAuth } from 'react-oidc-context';

type PrivateRouteProps = {
  children: JSX.Element;
};
export function PrivateRoute({ children }: PrivateRouteProps) {
  const auth = useAuth();

  if (!auth.isAuthenticated && !auth.isLoading) {
    auth.signinRedirect();
  }

  return auth.isAuthenticated ? children : null;
}
