import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { StrictMode,useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { PortalHeader } from './components/Core/PortalHeader';
import { SideNav } from './components/Core/SideNav';
import { SnailTrail } from './components/Core/SnailTrail';
import keycloak from './Keycloak';
import { Routes } from './screens/routes';
import { CurrentUserContext, GetLoggedInUserFromCookie, UserAccount } from './services/userAccount';

// import { userStore } from './stores/userStore';
import './App.scss';
import './Theme.scss';

library.add(faEllipsisH);
const menu = Routes.filter((r) => r.description);

export function App() {
  const location = useLocation();
  const [LoggedInUser, SetLoggedInUser] = useState<UserAccount | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    async function loadUser() {
      const user = await GetLoggedInUserFromCookie();
      SetLoggedInUser(user);
    }
    loadUser();
  }, []);
  const userContext = useMemo(
    () => ({
      LoggedInUser,
      SetLoggedInUser,
    }),
    [LoggedInUser]
  );
  const setDarkMode = (darkMode: boolean) => {
    if (darkMode) rootRef.current!.classList.add('darkmode');
    else rootRef.current!.classList.remove('darkmode');
  };
  const currentLocationDescription = menu.filter((m) => m.path === location.pathname)[0]
    .description;
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        checkLoginIframe: false,
      }}
    >
      <StrictMode>
        <CurrentUserContext.Provider value={userContext}>
          <div className='app' ref={rootRef}>
            <PortalHeader username={keycloak.profile?.email} setDarkMode={setDarkMode} />
            <div className='app-panel'>
              <SideNav menu={menu} />
              <div className='content'>
                <SnailTrail location={currentLocationDescription} />
                <Outlet />
              </div>
            </div>
          </div>
        </CurrentUserContext.Provider>
      </StrictMode>
    </ReactKeycloakProvider>
  );
}
