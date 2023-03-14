import { Outlet } from 'react-router-dom';

import { AccountPendingRoute } from './accountPending';
import { CreateAccountRoute } from './createAccount';
import { DashboardRoute } from './dashboard';
import { LoginRoute } from './login';
import { makePrivateRoute, PortalRoute } from './routeUtils';

const AccountCreationRoute: PortalRoute = {
  path: '/account',
  description: 'CreateAccount',
  element: (
    <div className='app-panel app-centralize'>
      <Outlet />
    </div>
  ),
  children: [CreateAccountRoute, AccountPendingRoute],
};

export const Routes: PortalRoute[] = [
  LoginRoute,
  DashboardRoute,
  makePrivateRoute(AccountCreationRoute),
];
