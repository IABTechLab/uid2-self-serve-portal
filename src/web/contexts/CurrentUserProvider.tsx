import { useKeycloak } from '@react-keycloak/web';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { GetUserAccountByEmail, UserAccount } from '../services/userAccount';

type UserContextWithSetter = {
  LoggedInUser: UserAccount | null;
};
export const CurrentUserContext = createContext<UserContextWithSetter>({
  LoggedInUser: null,
});

function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { keycloak } = useKeycloak();
  const [LoggedInUser, SetLoggedInUser] = useState<UserAccount | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const kcToken = keycloak?.token ?? '';

  useEffect(() => {
    if (LoggedInUser && !LoggedInUser.user && location.pathname !== '/accont/create') {
      navigate('/account/create');
    }
  }, [LoggedInUser, location.pathname, navigate]);

  const userContext = useMemo(
    () => ({
      LoggedInUser,
    }),
    [LoggedInUser]
  );
  useEffect(() => {
    const loadUser = async () => {
      const profile = await keycloak.loadUserProfile();
      const user = await GetUserAccountByEmail(profile?.email);
      SetLoggedInUser({
        profile,
        user,
      });
    };
    if (kcToken) {
      loadUser();
    }
  }, [kcToken, keycloak, SetLoggedInUser]);

  return <CurrentUserContext.Provider value={userContext}>{children}</CurrentUserContext.Provider>;
}

export { CurrentUserProvider };
