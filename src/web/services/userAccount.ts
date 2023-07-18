import axios from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import log from 'loglevel';
import { z } from 'zod';

import { User, UserCreationPartial, UserDTO } from '../../api/entities/User';
import { backendError } from '../utils/apiError';

export type UserAccount = {
  profile: KeycloakProfile;
  user: User | null;
};

export type InviteTeamMemberForm = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export type UserPayload = z.infer<typeof UserCreationPartial>;
export type UserResponse = UserDTO;
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

export async function ResendInvite(id: number): Promise<void> {
  try {
    await axios.post(`/users/${id}/resendInvitation`);
  } catch (e: unknown) {
    const error = backendError(e, 'Unable to resent invite.');
    log.error(error);
    throw error;
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

export async function GetAllUsersOfParticipant(participantId?: number) {
  try {
    const result = await axios.get<UserResponse[]>(
      `/participants/${participantId ?? 'current'}/users`,
      {
        validateStatus: (status) => [200, 404].includes(status),
      }
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load users');
  }
}

export async function RemoveUser(id: number) {
  try {
    await axios.delete(`/users/${id}`);
  } catch (e: unknown) {
    throw backendError(e, 'Could not delete user');
  }
}

export async function UpdateUser(id: number, formData: InviteTeamMemberForm) {
  try {
    await axios.put(`/users/${id}`, formData);
  } catch (e: unknown) {
    throw backendError(e, 'Could not update user');
  }
}
