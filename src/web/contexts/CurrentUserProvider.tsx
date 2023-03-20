import { useKeycloak } from '@react-keycloak/web';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { GetUserAccountByEmail, UserAccount } from '../services/userAccount';

type UserContextWithSetter = {
  LoggedInUser: UserAccount | null;
  loadUser: () => Promise<void>;
};
export const CurrentUserContext = createContext<UserContextWithSetter>({
  LoggedInUser: null,
  loadUser: async () => {
    'Unable to load user';
  },
});

function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { keycloak } = useKeycloak();
  const [LoggedInUser, SetLoggedInUser] = useState<UserAccount | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const kcToken = keycloak?.token ?? '';

  const loadUser = useCallback(async () => {
    const profile = await keycloak.loadUserProfile();
    const user = await GetUserAccountByEmail(profile?.email);
    SetLoggedInUser({
      profile,
      user,
    });
  }, [keycloak]);

  useEffect(() => {
    if (LoggedInUser && !LoggedInUser.user && location.pathname !== '/accont/create') {
      navigate('/account/create');
    }
  }, [LoggedInUser, location.pathname, navigate]);

  useEffect(() => {
    if (kcToken) {
      loadUser();
    }
  }, [kcToken, keycloak, SetLoggedInUser, loadUser]);

  const userContext = useMemo(
    () => ({
      LoggedInUser,
      loadUser,
    }),
    [LoggedInUser, loadUser]
  );

  return <CurrentUserContext.Provider value={userContext}>{children}</CurrentUserContext.Provider>;
}

export { CurrentUserProvider };
