import { useKeycloak } from '@react-keycloak/web';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Loading } from '../components/Core/Loading';
import { GetLoggedInUserAccount, UserAccount } from '../services/userAccount';
import { useAsyncThrowError } from '../utils/errorHandler';

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
  const [loading, setIsLoading] = useState<boolean>(true);
  const [LoggedInUser, SetLoggedInUser] = useState<UserAccount | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const throwError = useAsyncThrowError();

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const profile = await keycloak.loadUserProfile();
      const user = await GetLoggedInUserAccount();
      SetLoggedInUser({
        profile,
        user,
      });
    } catch (e: unknown) {
      if (e instanceof Error) throwError(e);
    } finally {
      setIsLoading(false);
    }
  }, [keycloak, throwError]);

  useEffect(() => {
    if (LoggedInUser && !LoggedInUser.user && location.pathname !== '/account/create') {
      navigate('/account/create');
    }
  }, [LoggedInUser, location.pathname, navigate]);

  useEffect(() => {
    if (keycloak.token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, [SetLoggedInUser, loadUser, keycloak.token]);

  const userContext = useMemo(
    () => ({
      LoggedInUser,
      loadUser,
    }),
    [LoggedInUser, loadUser]
  );

  return (
    <CurrentUserContext.Provider value={userContext}>
      {loading ? <Loading /> : children}
    </CurrentUserContext.Provider>
  );
}

export { CurrentUserProvider };
