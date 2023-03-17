import axios from 'axios';

import { DashboardRoute } from './dashboard';
import { LoginRoute } from './login';
import { PrivateRoute } from './PrivateRoute';
import { PortalRoute } from './routeTypes';
import { TeamMembersRoute } from './teamMembers';

export const apiClient = axios.create({
  baseURL: '/api',
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
  DashboardRoute,
  makePrivateRoute(TeamMembersRoute),
];
