import { useKeycloak } from '@react-keycloak/web';
import { useCallback } from 'react';

import { PortalRoute } from './routeTypes';

import './login.scss';

function Login() {
  const { keycloak } = useKeycloak();
  const login = useCallback(() => {
    keycloak?.login({ redirectUri: 'http://localhost:3000' });
  }, [keycloak]);

  const logout = useCallback(() => {
    keycloak?.logout({ redirectUri: 'http://localhost:3000' });
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
