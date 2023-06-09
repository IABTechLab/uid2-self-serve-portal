import axios from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import { z } from 'zod';

import { User, UserScheme } from '../../api/entities/User';
import { backendError } from '../utils/apiError';

export type UserAccount = {
  profile: KeycloakProfile;
  user: User | null;
};

export type UserPayload = z.infer<typeof UserScheme>;

export async function GetUserAccountById(id: string) {
  try {
    const result = await axios.get<User>(`/users/${id}`, {
      validateStatus: (status) => [200, 404].includes(status),
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get user account');
  }
}

export async function GetUserAccountByEmail(email: string | undefined): Promise<User | null> {
  try {
    const result = await axios.get<User>(`/users?email=${email}`, {
      validateStatus: (status) => [200, 404].includes(status),
    });
    if (result.status === 200) return result.data;
    return null;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get user account');
  }
}

export async function ResendInvite(id: number): Promise<boolean> {
  try {
    await axios.post(`/users/${id}/resendInvitation`);
    return true;
  } catch {
    return false;
  }
}

export async function GetAllUsers() {
  try {
    const result = await axios.get<User[]>(`/users/`, {
      validateStatus: (status) => [200, 404].includes(status),
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load users');
  }
}

export async function CreateUser(userPayload: UserPayload) {
  try {
    const newUser = await axios.post<User>(`/users`, userPayload);
    return newUser.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not create user');
  }
}
