import axios from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import { z } from 'zod';

import {
  ParticipantCreationPartial,
  ParticipantSchema,
  ParticipantStatus,
} from '../../api/entities/Participant';
import { backendError } from '../utils/apiError';
import { UserPayload } from './userAccount';

export type ParticipantPayload = Omit<z.infer<typeof ParticipantSchema>, 'allowSharing'>;
export type ParticipantCreationPayload = z.infer<typeof ParticipantCreationPartial>;
export type ParticipantResponse = z.infer<typeof ParticipantSchema>;
export type CreateParticipantForm = {
  companyName: string;
  officeLocation: string;
  companyType: number[];
  role: string;
  canSign: boolean;
  signeeEmail: string;
};

export async function CreateParticipant(formData: CreateParticipantForm, user: KeycloakProfile) {
  const users = [
    {
      email: user.email!,
      role: formData.role,
      location: formData.officeLocation,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  ] as UserPayload[];
  if (!formData.canSign) {
    // TODO: New feature to send an invitation to the person who can sign?
  }

  const participantPayload: ParticipantCreationPayload = {
    name: formData.companyName,
    status: formData.canSign
      ? ParticipantStatus.AwaitingApproval
      : ParticipantStatus.AwaitingSigning,
    types: formData.companyType.map((typeId) => ({ id: typeId })),
    users,
  };
  const newParticipant = await axios.post<ParticipantResponse>(`/participants`, participantPayload);
  return newParticipant.data;
}

export async function GetParticipantByUserId(id: number) {
  try {
    const result = await axios.get<ParticipantResponse>(`/users/${id}/participant`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get participant');
  }
}

export async function GetAllParticipants() {
  try {
    const result = await axios.get<ParticipantResponse[]>(`/participants`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load participants');
  }
}

export type InviteTeamMemberForm = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export async function InviteTeamMember(formData: InviteTeamMemberForm, participantId: number) {
  try {
    return await axios.post(`/participants/${participantId}/invite`, formData);
  } catch (e: unknown) {
    throw backendError(e, 'Could not invite participants');
  }
}

export type UpdateParticipantForm = {
  location?: string;
  logo?: string;
};

export async function UpdateParticipant(formData: UpdateParticipantForm, participantId: number) {
  try {
    const result = await axios.put<ParticipantResponse>(`/participants/${participantId}`, formData);
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not update participant');
  }
}

export async function GetSharingParticipants(participantId: number) {
  try {
    const result = await axios.get<ParticipantResponse[]>(
      `/participants/${participantId}/sharingPermission`
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load sharing participants');
  }
}

export async function AddSharingParticipants(participantId: number, newParticipantSites: number[]) {
  try {
    const result = await axios.post<ParticipantResponse[]>(
      `/participants/${participantId}/sharingPermission/add`,
      {
        newParticipantSites,
      }
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not add sharing participants');
  }
}

export async function DeleteSharingParticipants(
  participantId: number,
  sharingSitesToRemove: number[]
) {
  try {
    const result = await axios.post<ParticipantResponse[]>(
      `/participants/${participantId}/sharingPermission/delete`,
      {
        sharingSitesToRemove,
      }
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not delete sharing participants');
  }
}
