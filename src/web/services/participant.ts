import axios, { AxiosError, isAxiosError } from 'axios';
import { KeycloakProfile } from 'keycloak-js';
import { z } from 'zod';

import { ApiRoleDTO } from '../../api/entities/ApiRole';
import { BusinessContactSchema } from '../../api/entities/BusinessContact';
import { ParticipantCreationPartial, ParticipantDTO } from '../../api/entities/Participant';
import { SignedParticipantDTO } from '../../api/entities/SignedParticipant';
import {
  ApiKeyDTO,
  ClientType,
  ParticipantApprovalResponse,
  SharingListResponse,
} from '../../api/services/adminServiceHelpers';
import { ParticipantRequestDTO } from '../../api/services/participantsService';
import { backendError } from '../utils/apiError';
import { InviteTeamMemberForm, UserPayload } from './userAccount';

export type ParticipantCreationPayload = z.infer<typeof ParticipantCreationPartial>;
export type CreateParticipantForm = {
  companyName: string;
  companyType: number[];
  jobFunction: string;
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
      jobFunction: formData.jobFunction,
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
    const newParticipant = await axios.post<ParticipantDTO>(`/participants`, participantPayload);
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

export async function GetUsersDefaultParticipant() {
  try {
    const result = await axios.get<ParticipantDTO>(`/users/current/participant`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get participant');
  }
}

export async function GetParticipantsAwaitingApproval() {
  try {
    const result = await axios.get<ParticipantRequestDTO[]>(`/participants/awaitingApproval`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load participants awaiting approval');
  }
}

export async function GetApprovedParticipants() {
  try {
    const result = await axios.get<ParticipantDTO[]>(`/participants/approved`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load approved participants');
  }
}

export async function GetSignedParticipants() {
  try {
    const result = await axios.get<SignedParticipantDTO[]>(`/participants/signed`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load signed participants');
  }
}

export async function GetParticipantApiKeys(participantId: number) {
  try {
    const result = await axios.get<ApiKeyDTO[]>(`/participants/${participantId}/apiKeys`);
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get participant API Keys');
  }
}

export async function GetParticipantApiKey(keyId: string, participantId: number) {
  try {
    const result = await axios.get<ApiKeyDTO>(`/participants/${participantId}/apiKey`, {
      params: { keyId },
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get API Key');
  }
}

export async function GetParticipantApiRoles(participantId: number) {
  try {
    const result = await axios.get<ApiRoleDTO[]>(`/participants/${participantId}/apiRoles`);

    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get participant API Permissions');
  }
}

export async function InviteTeamMember(formData: InviteTeamMemberForm, participantId: number) {
  try {
    return await axios.post(`/participants/${participantId}/invite`, formData);
  } catch (e: unknown) {
    throw backendError(e, 'Could not invite team member.');
  }
}

export async function GetSelectedParticipant(participantId: number) {
  try {
    const result = await axios.get<ParticipantDTO>(`/participants/${participantId}`, {
      validateStatus: (status) => status === 200,
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not get participant');
  }
}

export type UpdateParticipantForm = {
  apiRoles: number[];
  participantTypes: number[];
  participantName: string;
  crmAgreementNumber: string | null;
  siteId: number;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
};

export type AddParticipantForm = {
  participantName: string;
  apiRoles: number[];
  participantTypes: number[];
  siteId?: number;
  siteIdType: number;
  siteName?: string;
  jobFunction: string;
  crmAgreementNumber: string;
  firstName: string;
  lastName: string;
  email: string;
};

export async function AddParticipant(formData: AddParticipantForm) {
  const response = await axios.put(`/participants/`, formData);
  return response;
}

export async function UpdateParticipant(formData: UpdateParticipantForm, participantId: number) {
  try {
    await axios.put(`/participants/${participantId}`, formData);
  } catch (e: unknown) {
    throw backendError(e, 'Could not update participant');
  }
}

export async function CompleteRecommendations(participantId: number): Promise<ParticipantDTO> {
  try {
    await axios.put<ParticipantDTO>(`/participants/${participantId}/completeRecommendations`);
    const result = await GetUsersDefaultParticipant();
    return result;
  } catch (e: unknown) {
    throw backendError(e, 'Could not update participant');
  }
}

export async function GetSharingList(participantId: number): Promise<SharingListResponse> {
  const result = await axios.get<SharingListResponse>(
    `/participants/${participantId}/sharingPermission`
  );
  return result.data;
}

export async function AddSharingParticipants(
  participantId: number,
  newParticipantSites: number[]
): Promise<SharingListResponse> {
  try {
    const result = await axios.post<SharingListResponse>(
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
): Promise<SharingListResponse> {
  try {
    const result = await axios.post<SharingListResponse>(
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

export async function UpdateSharingTypes(
  participantId: number,
  types: ClientType[]
): Promise<SharingListResponse> {
  try {
    const result = await axios.post<SharingListResponse>(
      `/participants/${participantId}/sharingPermission/shareWithTypes`,
      {
        types,
      }
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not update sharing types');
  }
}

export type BusinessContactResponse = z.infer<typeof BusinessContactSchema>;

export type BusinessContactForm = {
  name: string;
  emailAlias: string;
  contactType: string;
};

export async function AddEmailContact(formData: BusinessContactForm, participantId: number) {
  try {
    return await axios.post(`/participants/${participantId}/businessContacts`, formData);
  } catch (e: unknown) {
    throw backendError(e, 'Could not add email contact');
  }
}

export async function GetEmailContacts(participantId: number) {
  try {
    const result = await axios.get<BusinessContactResponse[]>(
      `/participants/${participantId}/businessContacts`
    );
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not load email contacts');
  }
}

export async function RemoveEmailContact(contactId: number, participantId: number) {
  try {
    return await axios.delete(`/participants/${participantId}/businessContacts/${contactId}`);
  } catch (e: unknown) {
    throw backendError(e, 'Could not delete email contact');
  }
}

export async function UpdateEmailContact(
  contactId: number,
  formData: BusinessContactForm,
  participantId: number
) {
  try {
    return await axios.put(
      `/participants/${participantId}/businessContacts/${contactId}`,
      formData
    );
  } catch (e: unknown) {
    throw backendError(e, 'Could not update email contact');
  }
}

export type ParticipantApprovalFormDetails = {
  name: string;
  types: number[];
  apiRoles: number[];
  siteId: number;
};

export async function ApproveParticipantRequest(
  participantId: number,
  formData: ParticipantApprovalFormDetails
): Promise<ParticipantApprovalResponse> {
  try {
    const result = await axios.put(`/participants/${participantId}/approve`, {
      name: formData.name,
      siteId: formData.siteId,
      types: formData.types.map((typeId) => ({ id: typeId })),
      apiRoles: formData.apiRoles.map((roleId) => ({ id: roleId })),
    });
    return result.data;
  } catch (e: unknown) {
    throw backendError(e, 'Could not approve participant');
  }
}
