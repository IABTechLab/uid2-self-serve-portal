import { useKeycloak } from '@react-keycloak/web';
import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Dialog } from '../components/Core/Dialog/Dialog';
import { SideNav } from '../components/Navigation/SideNav';
import { SnailTrail } from '../components/SnailTrail/SnailTrail';
import { TermsAndConditionsForm } from '../components/TermsAndConditions/TermsAndConditions';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { SetTermsAccepted } from '../services/userAccount';
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
  const location = useLocation();
  const { participant } = useContext(ParticipantContext);
  const { LoggedInUser, loadUser } = useContext(CurrentUserContext);
  const [showMustAccept, setShowMustAccept] = useState(false);
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const adminMenu = LoggedInUser?.user?.isApprover ? AdminRoutes.filter((r) => r.description) : [];
  const visibleMenu = standardMenu.concat(adminMenu);
  const currentLocationDescription = visibleMenu.filter((m) => m.path === location.pathname)[0]
    .description;

  const handleAccept = async () => {
    await SetTermsAccepted();
    // Force token refresh after role updated
    await keycloak.updateToken(10000);
    await loadUser();
  };
  const handleCancel = () => {
    setShowMustAccept(true);
  };

  useEffect(() => {
    if (!participant) {
      navigate('/account/create');
    }
  }, [participant, navigate]);
  return (
    <div className='app-panel'>
      <SideNav standardMenu={standardMenu} adminMenu={adminMenu} />
      <div className='dashboard-content'>
        <SnailTrail location={currentLocationDescription} />
        {!LoggedInUser?.user?.acceptedTerms ? (
          <Dialog className='terms-conditions-dialog'>
            <TermsAndConditionsForm onAccept={handleAccept} onCancel={handleCancel}>
              {showMustAccept && (
                <div className='accept-error'>
                  Please review the Terms and Conditions document. When you’ve scrolled to the
                  bottom, click <b>Accept Terms and Conditions</b>.
                </div>
              )}
            </TermsAndConditionsForm>
          </Dialog>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}
export const DashboardRoute: PortalRoute = {
  path: '/',
  description: 'Dashboard',
  element: <Dashboard />,
  errorElement: <RouteErrorBoundary />,
  children: DashboardRoutes,
};
