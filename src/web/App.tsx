import { useKeycloak } from '@react-keycloak/web';
import { StrictMode, useCallback, useContext, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { EnvironmentBanner } from './components/Core/EnvironmentBanner';
import { Loading } from './components/Core/Loading';
import { PortalHeader } from './components/Core/PortalHeader';
import { configureFontAwesomeLibrary } from './configureFontAwesomeLibrary';
import { CurrentUserContext } from './contexts/CurrentUserProvider';
import { ParticipantProvider } from './contexts/ParticipantProvider';
import { PortalErrorBoundary } from './utils/PortalErrorBoundary';

import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

configureFontAwesomeLibrary();

export function App() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const rootRef = useRef<HTMLDivElement>(null);
  const { keycloak, initialized } = useKeycloak();
  const logout = useCallback(() => {
    keycloak?.logout();
  }, [keycloak]);

  const setDarkMode = (darkMode: boolean) => {
    if (darkMode) rootRef.current!.classList.add('darkmode');
    else rootRef.current!.classList.remove('darkmode');
  };
  if (!initialized) return <Loading />;
  const fullName =
    LoggedInUser?.profile.firstName || LoggedInUser?.profile.lastName
      ? `${LoggedInUser?.profile.firstName ?? ''} ${LoggedInUser?.profile.lastName ?? ''}`
      : undefined;
  return (
    <StrictMode>
      <PortalErrorBoundary>
        <ParticipantProvider>
          <div className='app' ref={rootRef}>
            <PortalHeader
              email={LoggedInUser?.profile?.email}
              fullName={fullName}
              setDarkMode={setDarkMode}
              logout={logout}
            />
            <EnvironmentBanner />
            <Outlet />
            <ToastContainer hideProgressBar />
          </div>
        </ParticipantProvider>
      </PortalErrorBoundary>
    </StrictMode>
  );
}
