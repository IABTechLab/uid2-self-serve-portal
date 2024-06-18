import { FaroErrorBoundary } from '@grafana/faro-react';
import { useKeycloak } from '@react-keycloak/web';
import { StrictMode, useCallback, useContext, useRef } from 'react';
import { Outlet } from 'react-router-dom';

import { EnvironmentBanner } from './components/Core/EnvironmentBanner';
import { Loading } from './components/Core/Loading';
import { PortalHeader } from './components/Core/PortalHeader';
import { ToastContainerWrapper } from './components/Core/Toast';
import { UpdatesTour } from './components/SiteTour/UpdatesTour';
import { configureFontAwesomeLibrary } from './configureFontAwesomeLibrary';
import { CurrentUserContext } from './contexts/CurrentUserProvider';
import { ParticipantProvider } from './contexts/ParticipantProvider';
import { PortalErrorBoundary } from './utils/PortalErrorBoundary';

import 'react-toastify/dist/ReactToastify.min.css';
import './App.scss';

configureFontAwesomeLibrary();

export function App() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  const rootRef = useRef<HTMLDivElement>(null);
  const { keycloak, initialized } = useKeycloak();
  const logout = useCallback(() => {
    keycloak?.logout();
  }, [keycloak]);
  /*
  const setDarkMode = (darkMode: boolean) => {
    if (darkMode) rootRef.current!.classList.add('darkmode');
    else rootRef.current!.classList.remove('darkmode');
  };
  */
  if (!initialized) return <Loading />;
  const fullName =
    LoggedInUser?.profile.firstName || LoggedInUser?.profile.lastName
      ? `${LoggedInUser?.profile.firstName ?? ''} ${LoggedInUser?.profile.lastName ?? ''}`
      : undefined;
  const isLocalDev = process.env.NODE_ENV === 'development';

  return (
    <StrictMode>
      {/* <PortalErrorBoundary> */}
      <FaroErrorBoundary onError={(error) => console.info(error)}>
        <ParticipantProvider>
          <div className='app' ref={rootRef}>
            {LoggedInUser && <UpdatesTour />}
            <PortalHeader
              email={LoggedInUser?.profile?.email}
              fullName={fullName}
              // setDarkMode={setDarkMode}
              logout={logout}
            />
            {isLocalDev && <EnvironmentBanner />}
            <Outlet />
            <ToastContainerWrapper />
          </div>
        </ParticipantProvider>
      </FaroErrorBoundary>
      {/* </PortalErrorBoundary> */}
    </StrictMode>
  );
}
