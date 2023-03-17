import { AxiosInstance } from 'axios';
import { createContext } from 'react';
import { getCookie } from 'typescript-cookie';

export type UserAccount = {
  email: string;
  name: string;
  location: string;
  id: string;
};

const userCookie = 'uid2_ss_auth';

type UserContextWithSetter = {
  LoggedInUser: UserAccount | null;
  SetLoggedInUser: (account: UserAccount | null) => void;
};
export const CurrentUserContext = createContext<UserContextWithSetter>({
  LoggedInUser: null,
  SetLoggedInUser: () => {
    throw Error('No user context available');
  },
});

async function GetUserAccountById(apiClient: AxiosInstance | undefined, id: string) {
  if (!apiClient) throw Error('Unauthorized');
  const result = await apiClient.get<UserAccount>(`/users/${id}`);
  if (result.status === 200) {
    return result.data;
  }
  throw Error('Could not get user account');
}

export function GetLoggedInUserFromCookie(apiClient?: AxiosInstance) {
  const userId = getCookie(userCookie);
  if (userId) return GetUserAccountById(apiClient, userId);
  return null;
}

export async function GetAllUsers(apiClient: AxiosInstance | undefined) {
  if (!apiClient) throw Error('Unauthorized');
  const result = await apiClient.get<UserAccount[]>(`/users/`);
  if (result.status === 200) {
    return result.data;
  }
  throw Error('Could not load users');
}
