import { useContext, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { SideNav } from '../components/Core/SideNav';
import { SnailTrail } from '../components/Core/SnailTrail';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { AccountInformationRoute } from './accountInformation';
import { EmailContactsRoute } from './emailContacts';
import { HomeRoute } from './home';
import { PortalRoute } from './routeUtils';
import { SharingPermissionsRoute } from './sharingPermissions';
import { TeamMembersRoute } from './teamMembers';
import { TermsOfServiceRoute } from './termsOfService';

import './dashboard.scss';

export const DashboardRoutes: PortalRoute[] = [
  HomeRoute,
  SharingPermissionsRoute,
  AccountInformationRoute,
  TeamMembersRoute,
  EmailContactsRoute,
  TermsOfServiceRoute,
];
const menu = DashboardRoutes.filter((r) => r.description);

function Dashboard() {
  const location = useLocation();
  const { participant } = useContext(ParticipantContext);
  const navigate = useNavigate();

  const currentLocationDescription = menu.filter((m) => m.path === location.pathname)[0]
    .description;

  useEffect(() => {
    if (!participant) {
      navigate('/account/create');
    }
  }, [participant, navigate]);
  return (
    <div className='app-panel'>
      <SideNav menu={menu} />
      <div className='dashboard-content'>
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
