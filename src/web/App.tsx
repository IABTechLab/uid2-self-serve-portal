import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faEllipsisH,
  faPencil,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { useKeycloak } from '@react-keycloak/web';
import { StrictMode, useCallback, useContext, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';

import { PortalHeader } from './components/Core/PortalHeader';
import { CurrentUserContext, CurrentUserProvider } from './contexts/CurrentUserProvider';

import './App.scss';

library.add(faEllipsisH);
library.add(faPencil);
library.add(faTrashCan);
library.add(faChevronDown);

export function App() {
  const { LoggedInUser, loadUser } = useContext(CurrentUserContext);
  const rootRef = useRef<HTMLDivElement>(null);
  const { keycloak, initialized } = useKeycloak();
  const kcToken = keycloak?.token ?? '';
  const logout = useCallback(() => {
    keycloak?.logout();
  }, [keycloak]);

  useEffect(() => {
    if (kcToken) {
      loadUser();
    }
  }, [kcToken, loadUser]);

  const setDarkMode = (darkMode: boolean) => {
    if (darkMode) rootRef.current!.classList.add('darkmode');
    else rootRef.current!.classList.remove('darkmode');
  };
  if (!initialized) return <div>Loading...</div>;
  const fullname =
    LoggedInUser?.profile.firstName && LoggedInUser?.profile.lastName
      ? `${LoggedInUser?.profile.firstName} ${LoggedInUser?.profile.lastName}`
      : undefined;
  return (
    <StrictMode>
      <div className='app' ref={rootRef}>
        <PortalHeader
          email={LoggedInUser?.profile?.email}
          fullname={fullname}
          setDarkMode={setDarkMode}
          logout={logout}
        />
        <Outlet />
      </div>
    </StrictMode>
  );
}
