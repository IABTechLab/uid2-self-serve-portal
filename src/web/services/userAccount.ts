import axios, { AxiosError } from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import { z } from 'zod';

import { User, UserScheme } from '../../api/entities/User';

export type UserAccount = {
  profile: KeycloakProfile;
  user: User | null;
};

export type UserPayload = z.infer<typeof UserScheme>;

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
    const result = await axios.get<User>(`/users?email=${email}`);
    return result.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError && e.response?.status === 404) return null;
    throw Error('Could not get user account');
  }
}

export async function GetAllUsers() {
  const result = await axios.get<User[]>(`/users/`);
  if (result.status === 200) {
    return result.data;
  }
  throw Error('Could not load users');
}

export async function CreateUser(userPayload: UserPayload) {
  const newUser = await axios.post<User>(`/users`, userPayload);
  return newUser.data;
}

export type InviteTeamMemberForm = {
  firstName: string;
  lastName: string;
  email: string;
  jobFunction: string;
};

export async function inviteTeamMember(formData: InviteTeamMemberForm) {
  const newUser = await axios.post<User>(`/users/invite`, formData);
  return newUser.data;
}
