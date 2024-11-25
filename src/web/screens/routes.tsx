import { AccountPendingRoute } from './accountPending';
import { DashboardRoute } from './dashboard';
import { makePrivateRoute, PortalRoute } from './routeUtils';
import { SelfReinviteRoute } from './selfReinvite';

export const Routes: PortalRoute[] = [
  makePrivateRoute(DashboardRoute),
  makePrivateRoute(AccountPendingRoute),

  // Unauthenticated routes
  SelfReinviteRoute,
];
