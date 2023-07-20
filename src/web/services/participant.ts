import axios, { AxiosError, isAxiosError } from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import { z } from 'zod';

import { BusinessContactSchema } from '../../api/entities/BusinessContact';
import { ParticipantCreationPartial, ParticipantSchema } from '../../api/entities/Participant';
import { AvailableParticipantDTO } from '../../api/participantsRouter';
import { backendError } from '../utils/apiError';
import { UserPayload } from './userAccount';

export type ParticipantCreationPayload = z.infer<typeof ParticipantCreationPartial>;
export type ParticipantResponse = z.infer<typeof ParticipantSchema>;
export type CreateParticipantForm = {
  companyName: string;
  companyType: number[];
  role: string;
  canSign: boolean;
  signeeEmail: string;
  agreeToTerms: boolean;
};

export const isCreateParticipantError = (error: unknown): error is CreateParticipantError => {
  return (
    axios.isAxiosError(error) &&
    Array.isArray(error.response?.data) &&
    error.response!.data.every((d) => typeof d.message === 'string')
  );
};
type CreateParticipantErrorOptionalResponse = AxiosError<{ message: string }[]>;
export type CreateParticipantError = Required<
  Pick<CreateParticipantErrorOptionalResponse, 'response'>
> &
  Omit<CreateParticipantErrorOptionalResponse, 'response'>;

export async function CreateParticipant(formData: CreateParticipantForm, user: KeycloakProfile) {
  const users = [
    {
      email: user.email!,
      role: formData.role,
      firstName: user.firstName,
      lastName: user.lastName,
      acceptedTerms: formData.agreeToTerms,
    },
  ] as UserPayload[];
  if (!formData.canSign) {
    // TODO: New feature to send an invitation to the person who can sign?
  }

  const participantPayload: ParticipantCreationPayload = {
    name: formData.companyName,
    types: formData.companyType.map((typeId) => ({ id: typeId })),
    users,
  };
  try {
    const newParticipant = await axios.post<ParticipantResponse>(
      `/participants`,
      participantPayload
    );
    return newParticipant.data;
  } catch (err: unknown | AxiosError<CreateParticipantError>) {
    const status = isAxiosError(err) ? err.response?.status : null;
    const responseMessages = isCreateParticipantError(err)
      ? err.response?.data.map((d) => d.message)
      : null;
    return {
      errorStatus: status ?? 'Unknown',
      messages: responseMessages ?? ['An unknown error occurred.'],
    };
  }
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

export async function GetAllAvailableParticipants() {
  try {
    const result = await axios.get<AvailableParticipantDTO[]>(`/participants/available`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load participants');
  }
}

export async function GetParticipantsAwaitingApproval() {
  try {
    const result = await axios.get<ParticipantResponse[]>(`/participants/awaitingApproval`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load participants awaiting approval');
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
    await axios.post(`/participants/${participantId}/invite`, formData);
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

export async function GetSharingParticipants(
  participantId?: number
): Promise<AvailableParticipantDTO[]> {
  try {
    const result = await axios.get<AvailableParticipantDTO[]>(
      `/participants/${participantId ?? 'current'}/sharingPermission`
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load sharing participants');
  }
}

export async function AddSharingParticipants(
  participantId: number,
  newParticipantSites: number[]
): Promise<AvailableParticipantDTO[]> {
  try {
    const result = await axios.post<AvailableParticipantDTO[]>(
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
): Promise<AvailableParticipantDTO[]> {
  try {
    const result = await axios.post<AvailableParticipantDTO[]>(
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

export type BusinessContactResponse = z.infer<typeof BusinessContactSchema>;

export type BusinessContactForm = {
  name: string;
  emailAlias: string;
  contactType: string;
};

export async function AddEmailContact(formData: BusinessContactForm, participantId?: number) {
  try {
    await axios.post(`/participants/${participantId ?? 'current'}/businessContacts`, formData);
  } catch (e: unknown) {
    throw backendError(e, 'Could not add email contact');
  }
}

export async function GetEmailContacts(participantId?: number) {
  try {
    const result = await axios.get<BusinessContactResponse[]>(
      `/participants/${participantId ?? 'current'}/businessContacts`
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load email contacts');
  }
}

export async function RemoveEmailContact(contactId: number, participantId?: number) {
  try {
    await axios.delete(`/participants/${participantId ?? 'current'}/businessContacts/${contactId}`);
  } catch (e: unknown) {
    throw backendError(e, 'Could not delete email contact');
  }
}

export async function UpdateEmailContact(
  contactId: number,
  formData: BusinessContactForm,
  participantId?: number
) {
  try {
    await axios.put(
      `/participants/${participantId ?? 'current'}/businessContacts/${contactId}`,
      formData
    );
  } catch (e: unknown) {
    throw backendError(e, 'Could not update email contact');
  }
}
