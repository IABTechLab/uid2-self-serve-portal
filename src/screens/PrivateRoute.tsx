import { useKeycloak } from '@react-keycloak/web';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  children: JSX.Element;
};
export function PrivateRoute({ children }: PrivateRouteProps) {
  const { keycloak } = useKeycloak();

  if (!keycloak?.authenticated) return <Navigate to='/login' />;
  return children;
}
