import { SyntheticEvent, useContext, useState } from 'react';
import { useKeycloak } from "@react-keycloak/web";

import { CurrentUserContext, SetLoggedInUserCookie } from '../services/userAccount';
import { PortalRoute } from './routeTypes';

import './login.scss';

function Login() {
  // const { SetLoggedInUser } = useContext(CurrentUserContext);
  const { keycloak } = useKeycloak();


  return (
    <div className='uid2-login'>
      {!keycloak.authenticated && (
        <button type="button" onClick={() => keycloak.login({redirectUri: 'http://localhost:3000'})}>
          Sign in
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
