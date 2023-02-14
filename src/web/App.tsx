import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
// import { userStore } from './stores/userStore';
import { useKeycloak } from '@react-keycloak/web';
import { StrictMode, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { PortalHeader } from './components/Core/PortalHeader';
import { SideNav } from './components/Core/SideNav';
import { SnailTrail } from './components/Core/SnailTrail';
import { apiClient, Routes } from './screens/routes';
import { CurrentUserContext, GetLoggedInUserFromCookie, UserAccount } from './services/userAccount';

import './App.scss';
import './Theme.scss';

library.add(faEllipsisH);
const menu = Routes.filter((r) => r.description);

export function App() {
  const location = useLocation();
  const [LoggedInUser, SetLoggedInUser] = useState<UserAccount | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { keycloak, initialized } = useKeycloak();
  useEffect(() => {
    async function loadUser() {
      const user = await GetLoggedInUserFromCookie(apiClient);
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

  const kcToken = keycloak?.token ?? '';
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use((config) => {
      // Attach current access token ref value to outgoing request headers
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = initialized ? `Bearer ${kcToken}` : undefined;
      return config;
    });

    // Return cleanup function to remove interceptors if apiClient updates
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
    };
  }, [initialized, kcToken]);

  const setDarkMode = (darkMode: boolean) => {
    if (darkMode) rootRef.current!.classList.add('darkmode');
    else rootRef.current!.classList.remove('darkmode');
  };
  const currentLocationDescription = menu.filter((m) => m.path === location.pathname)[0]
    .description;

  if (!initialized) return <div>Loading...</div>;
  return (
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
  );
}
