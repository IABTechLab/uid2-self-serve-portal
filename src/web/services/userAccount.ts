import axios, { AxiosError, AxiosInstance } from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import { createContext } from 'react';

import { User } from '../../api/entities/User';

export type UserAccount = {
  profile: KeycloakProfile;
  user: User | null;
};

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

export async function GetUserAccountById(id: string) {
  const result = await axios.get<User>(`/users/${id}`);
  if (result.status === 200) {
    return result.data;
  }
  throw Error('Could not get user account');
}

export async function GetUserAccountByEmail(
  // apiClient: AxiosInstance | undefined,
  email: string | undefined
) {
  // if (!apiClient) throw Error('Unauthorized');
  try {
    const result = await axios.get<User>(`/users/byEmail?email=${email}`);
    return result.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError && e.response?.status === 404) return null;
    throw Error('Could not get user account');
  }
}

export async function GetAllUsers() {
  // if (!apiClient) throw Error('Unauthorized');
  const result = await axios.get<User[]>(`/users/`);
  if (result.status === 200) {
    return result.data;
  }
  throw Error('Could not load users');
}
