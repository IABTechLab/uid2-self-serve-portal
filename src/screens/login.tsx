import { PortalRoute } from './routeTypes';

import './login.scss';

function Login() {
  return (
    <div className='uid2-login'>
      <div className='login-form'>
        Sign in here!
        <div className='input-item'>
          <label htmlFor='username'>
            Username
            <input type='text' name='username' />
          </label>
        </div>
        <div className='input-item'>
          <label htmlFor='password'>
            Password
            <input type='password' name='password' />
          </label>
        </div>
      </div>
    </div>
  );
}

export const LoginRoute: PortalRoute = {
  path: '/login',
  element: <Login />,
  description: 'Log in',
};
