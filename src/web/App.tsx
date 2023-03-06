import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faEllipsisH,
  faPencil,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { useKeycloak } from '@react-keycloak/web';
import { StrictMode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

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
  const { keycloak, initialized } = useKeycloak();
  const location = useLocation();
  const navigate = useNavigate();
  const kcToken = keycloak?.token ?? '';
  const logout = useCallback(() => {
    keycloak?.logout();
  }, [keycloak]);

  const setCurrentUser = useCallback(
    (userAcount: UserAccount) => {
      SetLoggedInUser(userAcount);
      if (!userAcount.user && location.pathname !== CreateAccountRoute.path) {
        navigate(CreateAccountRoute.path);
      }
    },
    [navigate, location.pathname]
  );
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
      const user = await GetUserAccountByEmail(profile?.email);
      setCurrentUser({
        profile,
        user,
      });
    }
    if (kcToken) {
      loadUser();
    }
  }, [keycloak, kcToken, setCurrentUser]);

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
            logout={logout}
          />
          <Outlet />
        </div>
      </CurrentUserContext.Provider>
    </StrictMode>
  );
}
