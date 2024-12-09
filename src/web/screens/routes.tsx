import { DashboardRoute } from './dashboard';
import { makePrivateRoute, PortalRoute } from './routeUtils';
import { SelfReinviteRoute } from './selfReinvite';

export const Routes: PortalRoute[] = [
  makePrivateRoute(DashboardRoute),

  // Unauthenticated routes
  SelfReinviteRoute,
];
