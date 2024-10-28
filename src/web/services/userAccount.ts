import axios from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import log from 'loglevel';
import { z } from 'zod';

import { UserCreationPartial } from '../../api/entities/User';
import { UserWithParticipantRoles } from '../../api/services/usersService';
import { backendError } from '../utils/apiError';

export type UserAccount = {
  profile: KeycloakProfile;
  user: UserWithParticipantRoles | null;
};

export type InviteTeamMemberForm = {
  firstName: string;
  lastName: string;
  email: string;
  jobFunction: string;
  userRoleId?: number;
};

export type UpdateTeamMemberForm = Omit<InviteTeamMemberForm, 'email'>;

export type UserPayload = z.infer<typeof UserCreationPartial>;
export type UserResponse = UserWithParticipantRoles;

export async function GetLoggedInUserAccount(): Promise<UserWithParticipantRoles | null> {
  try {
    const result = await axios.get<UserWithParticipantRoles>(`/users/current`, {
      validateStatus: (status) => [200, 404].includes(status),
    });
    if (result.status === 200) return result.data;
    return null;
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
    const result = await axios.get<UserResponse[]>(`/participants/${participantId}/users`, {
      validateStatus: (status) => [200, 404].includes(status),
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load users');
  }
}

export async function RemoveUser(id: number, participantId: number) {
  try {
    return await axios.delete(`/participants/${participantId}/users/${id}`);
  } catch (e: unknown) {
    throw backendError(e, 'Could not remove user');
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
