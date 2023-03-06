import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faEllipsisH,
  faPencil,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import { StrictMode, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { PortalHeader } from './components/Core/PortalHeader';
import { CreateAccountRoute } from './screens/createAccount';
import { CurrentUserContext, GetUserAccountByEmail, UserAccount } from './services/userAccount';

import './App.scss';

library.add(faEllipsisH);
library.add(faPencil);
library.add(faTrashCan);
library.add(faChevronDown);

export function App() {
  const [LoggedInUser, SetLoggedInUser] = useState<UserAccount | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();
  const kcToken = keycloak?.token ?? '';

  const userContext = useMemo(
    () => ({
      LoggedInUser,
      SetLoggedInUser,
    }),
    [LoggedInUser]
  );

  useEffect(() => {
    async function loadUser() {
      const profile = await keycloak.loadUserProfile();
      if (profile.email) {
        const user = await GetUserAccountByEmail(profile?.email);
        SetLoggedInUser({
          profile,
          user,
        });
      }
    }

    const requestInterceptor = axios.interceptors.request.use((config) => {
      // Attach current access token ref value to outgoing request headers
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = initialized ? `Bearer ${kcToken}` : undefined;
      return config;
    });

    // Return cleanup function to remove interceptors if apiClient updates
    return () => {
      loadUser();
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [initialized, kcToken, keycloak]);

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
      <CurrentUserContext.Provider value={userContext}>
        <div className='app' ref={rootRef}>
          <PortalHeader
            email={LoggedInUser?.profile?.email}
            fullname={fullname}
            setDarkMode={setDarkMode}
          />
          <Outlet />
        </div>
      </CurrentUserContext.Provider>
    </StrictMode>
  );
}
