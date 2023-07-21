import { Outlet } from 'react-router-dom';

import { AccountPendingRoute } from './accountPending';
import { CreateAccountRoute } from './createAccount';
import { DashboardRoute } from './dashboard';
import { makePrivateRoute, PortalRoute } from './routeUtils';

const AccountCreationRoute: PortalRoute = {
  path: '/account',
  description: 'CreateAccount',
  element: <Outlet />,
  children: [CreateAccountRoute, AccountPendingRoute],
};

export const Routes: PortalRoute[] = [
  makePrivateRoute(DashboardRoute),
  makePrivateRoute(AccountCreationRoute),
];
