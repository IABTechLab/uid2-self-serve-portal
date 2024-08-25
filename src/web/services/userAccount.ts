import axios from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import log from 'loglevel';
import { z } from 'zod';

import { User, UserCreationPartial, UserDTO } from '../../api/entities/User';
import { UserWithIsApprover } from '../../api/services/usersService';
import { backendError } from '../utils/apiError';

export type UserAccount = {
  profile: KeycloakProfile;
  user: UserWithIsApprover | null;
};

export type InviteTeamMemberForm = {
  firstName: string;
  lastName: string;
  email: string;
  jobFunction: string;
};

export type UpdateTeamMemberForm = Omit<InviteTeamMemberForm, 'email'>;

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

export async function GetLoggedInUserAccount(): Promise<UserWithIsApprover | null> {
  try {
    const result = await axios.get<UserWithIsApprover>(`/users/current`, {
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
    return await axios.post(`/users/${id}/resendInvitation`);
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
    const result = await axios.get<UserResponse[]>(
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

// TODO: make this only remove the user from the given participant in UID2-3852
export async function RemoveUser(id: number) {
  try {
    return await axios.delete(`/users/${id}`);
  } catch (e: unknown) {
    throw backendError(e, 'Could not delete user');
  }
}

export async function UpdateUser(id: number, formData: UpdateTeamMemberForm) {
  try {
    return await axios.patch(`/users/${id}`, formData);
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
