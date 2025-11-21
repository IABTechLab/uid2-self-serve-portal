import { useKeycloak } from '@react-keycloak/web';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { keycloak } = useKeycloak();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [LoggedInUser, SetLoggedInUser] = useState<UserAccount | null>(null);
  const throwError = useAsyncThrowError();

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const profile = await keycloak.loadUserProfile();
      const { user, isLocked } = await GetLoggedInUserAccount();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
  }, [keycloak, throwError]);

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
      {isLoading ? <Loading /> : children}
    </CurrentUserContext.Provider>
  );
}

export { CurrentUserProvider };
