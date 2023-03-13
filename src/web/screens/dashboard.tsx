import { Outlet, useLocation } from 'react-router-dom';

import { SideNav } from '../components/Core/SideNav';
import { SnailTrail } from '../components/Core/SnailTrail';
import { makePrivateRoute, PortalRoute } from './routeUtils';
import { TeamMembersRoute } from './teamMembers';

export const DashboardMainRoute: PortalRoute = {
  path: '/',
  description: 'Dashboard',
  element: <span>Main</span>,
};
export const DashboardRoutes: PortalRoute[] = [TeamMembersRoute, DashboardMainRoute].map(
  makePrivateRoute
);
const menu = DashboardRoutes.filter((r) => r.description);

function Dashboard() {
  const location = useLocation();

  const currentLocationDescription = menu.filter((m) => m.path === location.pathname)[0]
    .description;
  return (
    <div className='app-panel'>
      <SideNav menu={menu} />
      <div className='content'>
        <SnailTrail location={currentLocationDescription} />
        <Outlet />
      </div>
    </div>
  );
}
export const DashboardRoute: PortalRoute = {
  path: '/',
  description: 'Dashboard',
  element: <Dashboard />,
  children: DashboardRoutes,
};
