import { SyntheticEvent, useContext, useState } from 'react';

import { CurrentUserContext, SetLoggedInUserCookie } from '../services/userAccount';
import { PortalRoute } from './routeTypes';

import './login.scss';

function Login() {
  const { SetLoggedInUser } = useContext(CurrentUserContext);
  const [username, setUsername] = useState('');
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }
  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    SetLoggedInUser(await SetLoggedInUserCookie(username));
  }
  return (
    <div className='uid2-login'>
      <div className='input-item'>
        <label htmlFor='username'>
          Username to fake login for
          <input type='text' name='username' value={username} onChange={handleChange} />
        </label>
      </div>
      {/* <div className='input-item'>
          <label htmlFor='password'>
            Password
            <input type='password' name='password' />
          </label>
        </div> */}
      <button type='submit' onSubmit={handleSubmit}>
        Sign in
      </button>
    </div>
  );
}

export const LoginRoute: PortalRoute = {
  path: '/login',
  element: <Login />,
  description: 'Log in',
};
