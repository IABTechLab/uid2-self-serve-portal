import { useContext, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { SideNav } from '../components/Core/SideNav';
import { SnailTrail } from '../components/Core/SnailTrail';
import { CurrentUserContext } from '../services/userAccount';
import { PortalRoute } from './routeTypes';
import { TeamMembersRoute } from './teamMembers';

export const DashboardRoutes: PortalRoute[] = [TeamMembersRoute];
const menu = DashboardRoutes.filter((r) => r.description);

function Dashboard() {
  const location = useLocation();
  const { LoggedInUser } = useContext(CurrentUserContext);

  if (LoggedInUser === null) return <div>Not logged in!</div>;
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
