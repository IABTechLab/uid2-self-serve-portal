import { DashboardRoute } from './dashboard';
import { LoginRoute } from './login';
import { PortalRoute } from './routeTypes';
import { TeamMembersRoute } from './teamMembers';

export const Routes: PortalRoute[] = [LoginRoute, DashboardRoute, TeamMembersRoute];
