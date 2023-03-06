import axios from 'axios';

import { CreateAccountRoute } from './createAccount';
import { DashboardRoute } from './dashboard';
import { LoginRoute } from './login';
import { PrivateRoute } from './PrivateRoute';
import { PortalRoute } from './routeTypes';

export const apiClient = axios.create({
  baseURL: 'http://localhost:6540/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const makePrivateRoute = (route: PortalRoute): PortalRoute => {
  return {
    ...route,
    loader: route.curriedLoader ? route.curriedLoader(apiClient) : route.loader,
    element: <PrivateRoute>{route.element}</PrivateRoute>,
  };
};

export const Routes: PortalRoute[] = [
  LoginRoute,
  makePrivateRoute(DashboardRoute),
  makePrivateRoute(CreateAccountRoute),
];
