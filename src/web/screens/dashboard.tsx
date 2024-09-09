import { useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { SideNav } from '../components/Navigation/SideNav';
import { TermsAndConditionsDialog } from '../components/TermsAndConditions/TermsAndConditionsDialog';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { ApiKeyManagementRoute } from './apiKeyManagement';
import { ClientSideIntegrationRoute } from './clientSideIntegration';
import { EmailContactsRoute } from './emailContacts';
import { HomeRoute } from './home';
import { LogoutRoute } from './logout';
import { ManageParticipantsRoute } from './manageParticipants';
import { ParticipantInformationRoute } from './participantInformation';
import { PortalRoute } from './routeUtils';
import { SharingPermissionsRoute } from './sharingPermissions';
import { TeamMembersRoute } from './teamMembers';
import { TermsOfServiceRoute } from './termsOfService';

import './dashboard.scss';

export const StandardRoutes: PortalRoute[] = [
  HomeRoute,
  LogoutRoute,
  SharingPermissionsRoute,
  ParticipantInformationRoute,
  TeamMembersRoute,
  EmailContactsRoute,
  TermsOfServiceRoute,
  ApiKeyManagementRoute,
  ClientSideIntegrationRoute,
];

export const AdminRoutes: PortalRoute[] = [ManageParticipantsRoute];

export const DashboardRoutes: PortalRoute[] = [...StandardRoutes, ...AdminRoutes];

const standardMenu = StandardRoutes.filter((r) => r.description);

function Dashboard() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const adminMenu = LoggedInUser?.user?.isApprover ? AdminRoutes.filter((r) => r.description) : [];

  return (
    <div className='app-panel'>
      <SideNav standardMenu={standardMenu} adminMenu={adminMenu} />
      <div className='dashboard-content'>
        {!LoggedInUser?.user?.acceptedTerms ? <TermsAndConditionsDialog /> : <Outlet />}
      </div>
    </div>
  );
}
export const DashboardRoute: PortalRoute = {
  path: '',
  description: 'Dashboard',
  element: <Dashboard />,
  errorElement: <RouteErrorBoundary />,
  children: DashboardRoutes,
};
