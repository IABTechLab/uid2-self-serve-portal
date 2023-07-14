import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Dialog } from '../components/Core/Dialog';
import { SideNav } from '../components/Core/SideNav';
import { SnailTrail } from '../components/Core/SnailTrail';
import { TermsAndConditionsForm } from '../components/Core/TermsAndConditions';
import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { SetTermsAccepted } from '../services/userAccount';
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
  const { LoggedInUser, loadUser } = useContext(CurrentUserContext);
  const [showMustAccept, setShowMustAccept] = useState(false);
  const navigate = useNavigate();

  const currentLocationDescription = menu.filter((m) => m.path === location.pathname)[0]
    .description;

  const handleAccept = async () => {
    await SetTermsAccepted();
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
      <SideNav menu={menu} />
      <div className='dashboard-content'>
        <SnailTrail location={currentLocationDescription} />
        {!LoggedInUser?.user?.acceptedTerms ? (
          <Dialog open>
            <TermsAndConditionsForm onAccept={handleAccept} onCancel={handleCancel} />
            {showMustAccept && (
              <div className='accept-error'>
                You will not be able to access the portal unless you accept the terms of service.
                You must scroll to the bottom of the terms of service before you can accept them.
              </div>
            )}
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
  children: DashboardRoutes,
};
