import { useKeycloak } from '@react-keycloak/web';

import { PortalRoute } from './routeTypes';

import './login.scss';

function Login() {
  const { keycloak } = useKeycloak();

  return (
    <div className='uid2-login'>
      {!keycloak.authenticated ? (
        <button
          type='button'
          onClick={() => keycloak.login({ redirectUri: 'http://localhost:3000' })}
        >
          Sign in
        </button>
      ) : (
        <button
          type='button'
          onClick={() => keycloak.logout({ redirectUri: 'http://localhost:3000' })}
        >
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
