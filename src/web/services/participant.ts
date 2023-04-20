import axios from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import { z } from 'zod';

import { ParticipantSchema, ParticipantStatus } from '../../api/entities/Participant';
import { backendError } from '../utils/apiError';
import { UserPayload } from './userAccount';

export type ParticipantResponse = z.infer<typeof ParticipantSchema>;
export type CreateParticipantPayload = Omit<ParticipantResponse, 'id' | 'allowSharing'>;

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
  const participantPayload: CreateParticipantPayload = {
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

export async function GetAllParticipant() {
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
  allowSharing: boolean;
  location: string;
  logo: string;
};
