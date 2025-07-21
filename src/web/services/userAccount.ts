import axios, { AxiosError } from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import log from 'loglevel';
import { z } from 'zod';

import { UserCreationPartial } from '../../api/entities/Schemas';
import { UserDTO } from '../../api/entities/User';
import { UserWithParticipantRoles } from '../../api/services/usersService';
import { backendError } from '../utils/apiError';

export type UserAccount = {
  profile: KeycloakProfile;
  user: UserWithParticipantRoles | null;
  isLocked?: boolean;
};

export type InviteTeamMemberForm = {
  firstName: string;
  lastName: string;
  email: string;
  jobFunction: string;
  userRoleId?: number;
  setPrimaryContact?: boolean;
};

export type LoggedInUser = {
  user: UserWithParticipantRoles | null;
  isLocked?: boolean;
};

export type UpdateTeamMemberForm = Omit<InviteTeamMemberForm, 'email'>;

export type UserPayload = z.infer<typeof UserCreationPartial>;

export async function GetLoggedInUserAccount(): Promise<LoggedInUser> {
  try {
    const result = await axios.get<UserWithParticipantRoles>(`/users/current`, {
      validateStatus: (status) => [200, 403, 404].includes(status),
    });
    if (result.status === 403) return { user: null, isLocked: true };
    if (result.status === 200) return { user: result.data };
    return { user: null };
  } catch (e: unknown) {
    throw backendError(e, 'Could not get user account');
  }
}

export async function ResendInvite(id: number, participantId: number): Promise<void> {
  try {
    return await axios.post(`/participants/${participantId}/users/${id}/resendInvitation`);
  } catch (e: unknown) {
    const error = backendError(e, 'Unable to resend invitation');
    log.error(error);
    throw error;
  }
}

export type SelfResendInvitationForm = {
  email: string;
};

export async function SelfResendInvitation(formData: SelfResendInvitationForm): Promise<void> {
  try {
    const { email } = formData;
    return await axios.post(`/users/selfResendInvitation`, {
      email,
    });
  } catch (e: unknown) {
    const error = backendError(e, 'Unable to resend invitation');
    log.error(error);
    throw error;
  }
}

export async function GetAllUsersOfParticipant(participantId: number) {
  try {
    const result = await axios.get<UserWithParticipantRoles[]>(
      `/participants/${participantId}/users`,
      {
        validateStatus: (status) => [200, 404].includes(status),
      }
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load users');
  }
}

export async function RemoveUser(id: number, participantId: number) {
  try {
    return await axios.delete(`/participants/${participantId}/users/${id}`);
  } catch (e: unknown) {
    const message = `${e instanceof AxiosError ? e.response?.data[0]?.message ?? 'Could not remove user' : 'Could not remove user'}`;
    const error = backendError(e, message);
    throw error;
  }
}

export async function UpdateUser(
  id: number,
  formData: UpdateTeamMemberForm,
  participantId: number
) {
  try {
    return await axios.patch(`/participants/${participantId}/users/${id}`, formData);
  } catch (e: unknown) {
    throw backendError(e, 'Could not update user');
  }
}

export async function SetTermsAccepted() {
  try {
    return await axios.put('/users/current/acceptTerms');
  } catch (e: unknown) {
    throw backendError(e, 'Unable to mark terms as accepted.');
  }
}

export async function GetAllUsers() {
  try {
    const userResponse = await axios.get<UserDTO[]>('/manage/users');
    return userResponse.data;
  } catch (e: unknown) {
    throw backendError(e, 'Unable to get user list.');
  }
}

export async function ChangeUserLock(userId: number, isLocked: boolean) {
  try {
    return await axios.patch(`/manage/${userId}/changeLock`, { userId, isLocked });
  } catch (e: unknown) {
    throw backendError(e, 'Unable to update user lock status.');
  }
}
