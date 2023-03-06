import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import { useCallback, useContext, useEffect } from 'react';

import { CurrentUserContext } from '../services/userAccount';
import { PortalRoute } from './routeTypes';

import './login.scss';

function Login() {
  const { initialized, keycloak } = useKeycloak();
  const kcToken = keycloak?.token ?? '';
  const { SetLoggedInUser } = useContext(CurrentUserContext);
  const login = useCallback(() => {
    keycloak?.login();
  }, [keycloak]);

  const logout = useCallback(() => {
    keycloak?.logout({ redirectUri: 'http://localhost:3000' });
  }, [keycloak]);

  useEffect(() => {
    if (kcToken) {
      axios.interceptors.request.use((config) => {
        // Attach current access token ref value to outgoing request headers
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = initialized ? `Bearer ${kcToken}` : undefined;
        return config;
      });
    }
  }, [SetLoggedInUser, initialized, kcToken, keycloak]);
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
