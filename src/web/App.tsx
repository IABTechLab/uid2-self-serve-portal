import { useKeycloak } from '@react-keycloak/web';
import { StrictMode, useCallback, useContext, useRef } from 'react';
import { Outlet } from 'react-router-dom';

import { Loading } from './components/Core/Loading';
import { PortalHeader } from './components/Core/PortalHeader';
import { configureFontAwesomeLibrary } from './configureFontAwesomeLibrary';
import { CurrentUserContext } from './contexts/CurrentUserProvider';
import { ParticipantProvider } from './contexts/ParticipantProvider';

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
  const fullname =
    LoggedInUser?.profile.firstName || LoggedInUser?.profile.lastName
      ? `${LoggedInUser?.profile.firstName ?? ''} ${LoggedInUser?.profile.lastName ?? ''}`
      : undefined;
  return (
    <StrictMode>
      <ParticipantProvider>
        <div className='app' ref={rootRef}>
          <PortalHeader
            email={LoggedInUser?.profile?.email}
            fullname={fullname}
            setDarkMode={setDarkMode}
            logout={logout}
          />
          <Outlet />
        </div>
      </ParticipantProvider>
    </StrictMode>
  );
}
