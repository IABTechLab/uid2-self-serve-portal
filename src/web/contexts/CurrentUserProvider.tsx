import { useKeycloak } from '@react-keycloak/web';
import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { GetUserAccountByEmail, UserAccount } from '../services/userAccount';

type UserContextWithSetter = {
  LoggedInUser: UserAccount | null;
  loadUser: () => void;
};
export const CurrentUserContext = createContext<UserContextWithSetter>({
  LoggedInUser: null,
  loadUser: () => {
    throw Error('No user context available');
  },
});

function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { keycloak } = useKeycloak();
  const [LoggedInUser, SetLoggedInUser] = useState<UserAccount | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const setCurrentUser = useCallback(
    (userAcount: UserAccount | null) => {
      SetLoggedInUser(userAcount);
      if (userAcount && !userAcount.user && location.pathname !== '/createAccount') {
        navigate('/createAccount');
      }
    },
    [navigate, location.pathname]
  );

  const loadUser = useCallback(async () => {
    const profile = await keycloak.loadUserProfile();
    const user = await GetUserAccountByEmail(profile?.email);
    setCurrentUser({
      profile,
      user,
    });
  }, [keycloak, setCurrentUser]);

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
