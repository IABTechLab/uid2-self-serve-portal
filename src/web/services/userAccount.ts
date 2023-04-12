import axios, { AxiosError, AxiosResponse } from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import { z } from 'zod';

import { User, UserScheme } from '../../api/entities/User';
import { ApiError } from '../utils/apiError';

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
    if (e instanceof AxiosError) {
      const hash = e.response?.data?.errorHash as string;

      throw new ApiError('Could not get user account', {
        errorHash: hash,
        statusCode: e.status,
      });
    }
    throw Error('Could not get user account');
  }
}

export async function GetUserAccountByEmail(email: string | undefined) {
  try {
    const result: AxiosResponse<User> = await axios.get<User>(`/users?email=${email}`, {
      validateStatus: (status) => [200, 404].includes(status),
    });
    return result.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      const hash = e.response?.data?.errorHash as string;

      throw new ApiError('Could not get user account', {
        errorHash: hash,
        statusCode: e.status,
      });
    }
    throw Error('Could not get user account');
  }
}

export async function GetAllUsers() {
  try {
    const result = await axios.get<User[]>(`/users/`, {
      validateStatus: (status) => [200, 404].includes(status),
    });
    return result.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      const hash = e.response?.data?.errorHash as string;
      throw new ApiError('Could not get user account', {
        errorHash: hash,
        statusCode: e.status,
      });
    }
    throw Error('Could not load users');
  }
}

export async function CreateUser(userPayload: UserPayload) {
  try {
    const newUser = await axios.post<User>(`/users`, userPayload);
    return newUser.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      const hash = e.response?.data?.errorHash as string;
      throw new ApiError('Could not get user account', {
        errorHash: hash,
        statusCode: e.status,
      });
    }
    throw Error('Could not load users');
  }
}
