import axios from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import { z } from 'zod';

import { ParticipantSchema, ParticipantStatus } from '../../api/entities/Participant';
import { UserRole } from '../../api/entities/User';

export type ParticipantPayload = z.infer<typeof ParticipantSchema>;

export type CreateParticipantForm = {
  companyName: string;
  companyLocation: string;
  companyType: number[];
  role: string;
  canSign: boolean;
  signeeEmail: string;
};

export async function CreateParticipant(formData: CreateParticipantForm, user: KeycloakProfile) {
  const users = [
    {
      email: user.email!,
      role: formData.role as UserRole,
      location: formData.companyLocation,
    },
  ];
  if (!formData.canSign) {
    users.push({
      email: formData.signeeEmail,
      role: UserRole.Admin,
      location: formData.companyLocation,
    });
  }
  const participantPayload: ParticipantPayload = {
    name: formData.companyName,
    location: formData.companyLocation,
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
