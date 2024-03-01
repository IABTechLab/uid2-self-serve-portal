/* eslint-disable camelcase */
import axios, { AxiosError } from 'axios';
import { z } from 'zod';

import { ParticipantApprovalPartial } from '../entities/Participant';
import { SSP_ADMIN_SERVICE_BASE_URL, SSP_ADMIN_SERVICE_CLIENT_KEY } from '../envars';
import { getLoggers } from '../helpers/loggingHelpers';
import {
  AdminSiteDTO,
  ApiKeyAdmin,
  ClientType,
  CreatedApiKeyDTO,
  KeyPairDTO,
  mapClientTypesToAdminEnums,
  SharingListResponse,
  SiteCreationDTO,
  SiteDTO,
} from './adminServiceHelpers';
import { SiteRequest } from './usersService';

const adminServiceClient = axios.create({
  baseURL: SSP_ADMIN_SERVICE_BASE_URL,
  headers: {
    common: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SSP_ADMIN_SERVICE_CLIENT_KEY}`,
    },
  },
});

const DEFAULT_SHARING_SETTINGS: Pick<SharingListResponse, 'allowed_sites' | 'allowed_types'> = {
  allowed_types: ['DSP'],
  allowed_sites: [],
};

export const getSharingList = async (
  siteId: number,
  traceId: string
): Promise<SharingListResponse> => {
  try {
    const response = await adminServiceClient.get<SharingListResponse>(
      `/api/sharing/list/${siteId}`,
      {
        validateStatus: (status) => status >= 200 && status < 300,
      }
    );
    return response.data.allowed_sites
      ? response.data
      : { ...response.data, ...DEFAULT_SHARING_SETTINGS };
  } catch (error: unknown) {
    const { errorLogger } = getLoggers();
    if (error instanceof AxiosError) {
      error.message = `Site Id invalid`;
    }
    errorLogger.error(`${error}`, traceId);
    throw error;
  }
};

export const updateSharingList = async (
  siteId: number,
  hash: number,
  siteList: number[],
  typeList: ClientType[],
  traceId: string
): Promise<SharingListResponse> => {
  try {
    const response = await adminServiceClient.post<SharingListResponse>(
      `/api/sharing/list/${siteId}`,
      {
        allowed_sites: siteList,
        allowed_types: typeList,
        hash,
      },
      {
        validateStatus: (status) => status >= 200 && status < 300,
      }
    );
    return response.data.allowed_sites
      ? response.data
      : { ...response.data, ...DEFAULT_SHARING_SETTINGS };
  } catch (error: unknown) {
    const { errorLogger } = getLoggers();
    errorLogger.error(`Update ACLs failed: ${error}`, traceId);
    throw error;
  }
};

export const getSiteList = async (): Promise<AdminSiteDTO[]> => {
  const response = await adminServiceClient.get<AdminSiteDTO[]>('/api/site/list');
  return response.data;
};

export const getSite = async (siteId: number): Promise<AdminSiteDTO> => {
  const response = await adminServiceClient.get<AdminSiteDTO>(`/api/site/${siteId}`);
  return response.data;
};

export const getApiKeysBySite = async (siteId: number): Promise<ApiKeyAdmin[]> => {
  const response = await adminServiceClient.get<ApiKeyAdmin[]>(`/api/client/list/${siteId}`);
  return response.data;
};

export const getApiKeyById = async (keyId: String): Promise<ApiKeyAdmin> => {
  const response = await adminServiceClient.get<ApiKeyAdmin>(`/api/client/keyId`, {
    params: { keyId },
  });
  return response.data;
};

export const renameApiKey = async (contact: string, newName: string): Promise<void> => {
  await adminServiceClient.post('/api/client/rename', null, {
    params: { contact, newName },
  });
};

export const updateApiKeyRoles = async (contact: string, apiRoles: string[]): Promise<void> => {
  await adminServiceClient.post('/api/client/roles', null, {
    params: {
      contact,
      roles: apiRoles.join(', '),
    },
  });
};

export const disableApiKey = async (contact: string): Promise<void> => {
  await adminServiceClient.post('/api/client/disable', null, {
    params: {
      contact,
    },
  });
};

export const getVisibleSiteList = async (): Promise<AdminSiteDTO[]> => {
  const siteList = await getSiteList();
  return siteList.filter((x) => x.visible !== false);
};

export const getKeyPairsList = async (siteId: number): Promise<KeyPairDTO[]> => {
  const response = await adminServiceClient.get<KeyPairDTO[]>(
    `/api/v2/sites/${siteId}/client-side-keypairs`
  );
  return response.data;
};

export const addKeyPair = async (
  siteId: number,
  name: string,
  disabled: boolean = false
): Promise<KeyPairDTO> => {
  const response = await adminServiceClient.post<KeyPairDTO>('/api/client_side_keypairs/add', {
    site_id: siteId,
    disabled,
    name,
  });
  return response.data;
};

export const addSite = async (
  name: string,
  description: string,
  types: string
): Promise<SiteCreationDTO | null> => {
  const response = await adminServiceClient.post<SiteCreationDTO>('/api/site/add', null, {
    params: {
      name,
      description,
      types,
      enabled: true,
    },
  });
  return response.data;
};

export const setSiteClientTypes = async (
  participantApprovalPartial: z.infer<typeof ParticipantApprovalPartial>
): Promise<void> => {
  const adminTypes = mapClientTypesToAdminEnums(participantApprovalPartial.types).join(',');
  const response = await adminServiceClient.post('/api/site/set-types', null, {
    params: {
      id: participantApprovalPartial.siteId,
      types: adminTypes,
    },
  });
  return response.data;
};

export const createApiKey = async (
  name: string,
  roles: string[],
  siteId: number
): Promise<CreatedApiKeyDTO> => {
  const rolesString = roles.join(', ');
  const response = await adminServiceClient.post<CreatedApiKeyDTO>('/api/client/add', null, {
    params: {
      name,
      roles: rolesString,
      site_id: siteId,
    },
  });

  return response.data;
};
