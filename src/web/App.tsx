import { StrictMode, useCallback, useContext } from 'react';
import { useAuth } from 'react-oidc-context';
import { Outlet } from 'react-router-dom';

import { EnvironmentBanner } from './components/Core/Banner/EnvironmentBanner';
import { ErrorView } from './components/Core/ErrorView/ErrorView';
import { Loading } from './components/Core/Loading/Loading';
import { ToastContainerWrapper } from './components/Core/Popups/Toast';
import { LockedUserView } from './components/Navigation/LockedUserView';
import { NoParticipantAccessView } from './components/Navigation/NoParticipantAccessView';
import { PortalHeader } from './components/PortalHeader/PortalHeader';
import { UpdatesTour } from './components/SiteTour/UpdatesTour';
import { configureFontAwesomeLibrary } from './configureFontAwesomeLibrary';
import { CurrentUserContext } from './contexts/CurrentUserProvider';
import { ParticipantContext, ParticipantProvider } from './contexts/ParticipantProvider';
import { HomeRedirector } from './screens/homeRedirector';
import { PortalErrorBoundary } from './utils/PortalErrorBoundary';

import 'react-toastify/dist/ReactToastify.min.css';
import './App.scss';

configureFontAwesomeLibrary();

function AppContent() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const { participant } = useContext(ParticipantContext);
  const isLocalDev = process.env.NODE_ENV === 'development';

  if (LoggedInUser?.isLocked) {
    return <LockedUserView />;
  }
  if (LoggedInUser?.user?.participants!.length === 0) {
    return <ErrorView message='You do not have access to any participants.' />;
  }
  if (LoggedInUser && !participant) {
    return <NoParticipantAccessView user={LoggedInUser?.user} />;
  }

  const showUpdatesTour = !!LoggedInUser?.user?.acceptedTerms;

  return (
    <>
      <HomeRedirector />
      {showUpdatesTour && <UpdatesTour />}
      <Outlet />
      {isLocalDev && <EnvironmentBanner />}
    </>
  );
}

export function App() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const auth = useAuth();
  const logout = useCallback(() => {
    auth.removeUser();
  }, [auth]);

  const setDarkMode = (darkMode: boolean) => {
    if (darkMode) {
      document.getElementById('root')?.classList.add('darkmode');
      localStorage.setItem('isDarkMode', 'true');
    } else {
      document.getElementById('root')?.classList.remove('darkmode');
      localStorage.setItem('isDarkMode', 'false');
    }
  };

  const fullName =
    LoggedInUser?.profile.firstName || LoggedInUser?.profile.lastName
      ? `${LoggedInUser?.profile.firstName ?? ''} ${LoggedInUser?.profile.lastName ?? ''}`
      : undefined;

  if (auth.isLoading) return <Loading />;
  return (
    <StrictMode>
      <PortalErrorBoundary>
        <ParticipantProvider>
          <div className='app'>
            <PortalHeader
              email={LoggedInUser?.profile?.email}
              fullName={fullName}
              setDarkMode={setDarkMode}
              logout={logout}
            />
            <AppContent />
            <ToastContainerWrapper />
          </div>
        </ParticipantProvider>
      </PortalErrorBoundary>
    </StrictMode>
  );
}
