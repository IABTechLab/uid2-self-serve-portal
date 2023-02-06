import axios from 'axios';
import { createContext } from 'react';
import { getCookie, setCookie } from 'typescript-cookie';

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

async function GetUserAccountById(id: string) {
  const result = await axios.get<UserAccount>(`http://localhost:6540/api/users/${id}`);
  if (result.status === 200) {
    return result.data;
  }
  throw Error('Could not get user account');
}

export function GetLoggedInUserFromCookie() {
  const userId = getCookie(userCookie);
  if (userId) return GetUserAccountById(userId);
  return null;
}

export async function GetAllUsers() {
  const result = await axios.get<UserAccount[]>(`http://localhost:6540/api/users/`);
  if (result.status === 200) {
    return result.data;
  }
  throw Error('Could not load users');
}

export async function SetLoggedInUserCookie(email: string) {
  const result = await axios.post<UserAccount>(`http://localhost:6540/api/login`, {
    email,
  });
  console.log('Login response', result);
  if (result.status === 200) {
    setCookie(userCookie, result.data.id);
  }
  return result.data;
}
