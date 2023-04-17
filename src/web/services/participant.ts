import axios from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import { z } from 'zod';

import { ParticipantSchema, ParticipantStatus } from '../../api/entities/Participant';
import { UserPayload } from './userAccount';

export type ParticipantPayload = z.infer<typeof ParticipantSchema>;

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
  const participantPayload: ParticipantPayload = {
    name: formData.companyName,
    status: formData.canSign
      ? ParticipantStatus.AwaitingApproval
      : ParticipantStatus.AwaitingSigning,
    types: formData.companyType.map((typeId) => ({ id: typeId })),
    users,
  };
  const newParticipant = await axios.post<ParticipantPayload>(`/participants`, participantPayload);
  return newParticipant.data;
}

export async function GetParticipantByUserId(id: number) {
  const result = await axios.get<ParticipantPayload>(`/users/${id}/participant`);
  if (result.status === 200) {
    return result.data;
  }
  throw Error('Could not get participant');
}

export async function GetAllParticipant() {
  const result = await axios.get<ParticipantPayload[]>(`/participants`);
  if (result.status === 200) {
    return result.data;
  }
  throw Error('Could not load participants');
}

export type InviteTeamMemberForm = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export async function InviteTeamMember(formData: InviteTeamMemberForm, participantId: number) {
  return axios.post(`/participants/${participantId}/invite`, formData);
}

export type UpdateParticipantForm = {
  allowSharing: boolean;
  location: string;
  logo: string;
};
