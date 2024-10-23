import { useContext, useEffect, useState } from 'react';
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
import { TermsOfServiceRoute } from './termsOfService';

import './dashboard.scss';
import { isUid2Support } from '../../api/middleware/usersMiddleware';

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
  AuditTrailRoute,
];

export const Uid2SupportRoutes: PortalRoute[] = [ManageParticipantsRoute];

export const DashboardRoutes: PortalRoute[] = [...StandardRoutes, ...Uid2SupportRoutes];

const standardMenu = StandardRoutes.filter((r) => r.description);

function Dashboard() {
  const { LoggedInUser } = useContext(CurrentUserContext);

  const [uid2SupportMenu, setUid2SupportMenu] = useState<PortalRoute[]>([]);

  useEffect(() => {
    const isUid2Support2 = async () => {
      const isUid2Support2 = LoggedInUser?.user && (await isUid2Support(LoggedInUser?.user?.email));
      //return isUid2Support2 ? Uid2SupportRoutes.filter((r) => r.description) : [];
      if (isUid2Support2) setUid2SupportMenu(Uid2SupportRoutes.filter((r) => r.description));
    };
    isUid2Support2();
  });

  return (
    <div className='app-panel'>
      <SideNav standardMenu={standardMenu} uid2SupportMenu={uid2SupportMenu} />
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
