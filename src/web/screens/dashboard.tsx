import { useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { SideNav } from '../components/Navigation/SideNav';
import { TermsAndConditionsDialog } from '../components/TermsAndConditions/TermsAndConditionsDialog';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { RouteErrorBoundary } from '../utils/RouteErrorBoundary';
import { ApiKeyManagementRoute } from './apiKeyManagement';
import { AuditTrailRoute } from './auditTrailScreen';
import { ClientSideIntegrationRoute } from './clientSideIntegration';
import { EmailContactsRoute } from './emailContacts';
import { HomeRoute } from './home';
import { LogoutRoute } from './logout';
import { ManageParticipantsRoute } from './manageParticipants';
import { ParticipantInformationRoute } from './participantInformation';
import { PortalRoute } from './routeUtils';
import { SharingPermissionsRoute } from './sharingPermissions';
import { TeamMembersRoute } from './teamMembers';

import './dashboard.scss';

export const StandardRoutes: PortalRoute[] = [
  HomeRoute,
  LogoutRoute,
  SharingPermissionsRoute,
  ParticipantInformationRoute,
  TeamMembersRoute,
  EmailContactsRoute,
  ApiKeyManagementRoute,
  ClientSideIntegrationRoute,
  AuditTrailRoute,
];

export const Uid2SupportRoutes: PortalRoute[] = [ManageParticipantsRoute];

// TODO: add route for Users List once created
export const SuperUserRoutes: PortalRoute[] = [];

export const DashboardRoutes: PortalRoute[] = [
  ...StandardRoutes,
  ...Uid2SupportRoutes,
  ...SuperUserRoutes,
];

const standardMenu = StandardRoutes.filter((r) => r.description);

function Dashboard() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const uid2SupportMenu = LoggedInUser?.user?.isUid2Support
    ? Uid2SupportRoutes.filter((r) => r.description)
    : [];
  const superUserMenu = LoggedInUser?.user?.isSuperUser
    ? SuperUserRoutes.filter((r) => r.description)
    : [];

  return (
    <div className='app-panel'>
      <SideNav
        standardMenu={standardMenu}
        uid2SupportMenu={uid2SupportMenu}
        superUserMenu={superUserMenu}
      />
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
