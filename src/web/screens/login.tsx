import { useKeycloak } from '@react-keycloak/web';
import { useCallback } from 'react';

import { PortalRoute } from './routeUtils';

import './login.scss';

function Login() {
  const { keycloak } = useKeycloak();
  const login = useCallback(() => {
    keycloak?.login({ redirectUri: window.location.origin });
  }, [keycloak]);

  const logout = useCallback(() => {
    keycloak?.logout({ redirectUri: window.location.origin });
  }, [keycloak]);

  return (
    <div className='uid2-login'>
      {!keycloak.authenticated ? (
        <button type='button' onClick={login}>
          Sign in
        </button>
      ) : (
        <button type='button' onClick={logout}>
          Log out
        </button>
      )}
    </div>
  );
}

export const LoginRoute: PortalRoute = {
  path: '/login',
  element: <Login />,
  description: 'Log in',
};
