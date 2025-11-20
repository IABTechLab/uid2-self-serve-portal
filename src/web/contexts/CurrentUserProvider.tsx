import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from 'react-oidc-context';

import { Loading } from '../components/Core/Loading/Loading';
import { GetLoggedInUserAccount, UserAccount } from '../services/userAccount';
import { useAsyncThrowError } from '../utils/errorHandler';

export type UserContextWithSetter = {
  LoggedInUser: UserAccount | null;
  loadUser: () => Promise<void>;
};
export const CurrentUserContext = createContext<UserContextWithSetter>({
  LoggedInUser: null,
  loadUser: async () => {
    'Unable to load user';
  },
});

function CurrentUserProvider({ children }: Readonly<{ children: ReactNode }>) {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [LoggedInUser, SetLoggedInUser] = useState<UserAccount | null>(null);
  const throwError = useAsyncThrowError();

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get profile from OIDC user object
      const profile = auth.user?.profile || {};
      const { user, isLocked } = await GetLoggedInUserAccount();
      SetLoggedInUser({
        profile,
        user,
        isLocked,
      });
    } catch (e: unknown) {
      if (e instanceof Error) throwError(e);
    } finally {
      setIsLoading(false);
    }
  }, [auth.user, throwError]);

  useEffect(() => {
    if (auth.user?.access_token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, [SetLoggedInUser, loadUser, auth.user?.access_token]);

  const userContext = useMemo(
    () => ({
      LoggedInUser,
      loadUser,
    }),
    [LoggedInUser, loadUser]
  );

  return (
    <CurrentUserContext.Provider value={userContext}>
      {isLoading ? <Loading /> : children}
    </CurrentUserContext.Provider>
  );
}

export { CurrentUserProvider };
