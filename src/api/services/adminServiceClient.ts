/* eslint-disable camelcase */
import axios, { AxiosError } from 'axios';
import { z } from 'zod';

import { ParticipantSchema } from '../entities/Participant';
import { ParticipantTypeSchema } from '../entities/ParticipantType';
import {
  SSP_ADMIN_SERVICE_BASE_URL,
  SSP_OKTA_AUTH_DISABLED,
  SSP_OKTA_AUTH_SERVER_URL,
  SSP_OKTA_CLIENT_ID,
  SSP_OKTA_CLIENT_SECRET,
} from '../envars';
import { getLoggers } from '../helpers/loggingHelpers';
import {
  AccessToken,
  AdminSiteDTO,
  ApiKeyAdmin,
  ClientType,
  CreatedApiKeyDTO,
  KeyPairDTO,
  mapClientTypesToAdminEnums,
  SharingListResponse,
  SiteCreationDTO,
} from './adminServiceHelpers';

let accessToken: string = '';
let accessTokenExpiry: number = 0;

const oktaClient = axios.create({
  baseURL: SSP_OKTA_AUTH_SERVER_URL,
  headers: {
    common: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${SSP_OKTA_CLIENT_ID}:${SSP_OKTA_CLIENT_SECRET}`,
        'binary'
      ).toString('base64')}`,
    },
  },
});

async function getAccessToken() {
  if (
    !accessToken ||
    !accessTokenExpiry ||
    Math.floor(Date.now() / 1000) + 600 > accessTokenExpiry
  ) {
    const response = await oktaClient.post<AccessToken>(
      '/v1/token?grant_type=client_credentials&scope=uid2.admin.ss-portal'
    );
    accessToken = response.data.access_token;
    accessTokenExpiry = Math.floor(Date.now() / 1000) + response.data.expires_in;
  }
  return accessToken;
}

const adminServiceClient = axios.create({
  baseURL: SSP_ADMIN_SERVICE_BASE_URL,
  headers: {
    common: {
      'Content-Type': 'application/json',
      Authorization: `Bearer `,
    },
  },
});

adminServiceClient.interceptors.request.use(async (config) => {
  const updated = config;
  if (SSP_OKTA_AUTH_DISABLED === 'false') {
    updated.headers.Authorization = `Bearer ${await getAccessToken()}`;
  }
  return config;
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

export const getApiKeyById = async (keyId: string): Promise<ApiKeyAdmin> => {
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

export const getKeyPairsList = async (
  siteId: number,
  showDisabled?: boolean
): Promise<KeyPairDTO[]> => {
  const response = await adminServiceClient.get<KeyPairDTO[]>(
    `/api/v2/sites/${siteId}/client-side-keypairs`
  );
  const allKeyPairs = response.data;
  if (!showDisabled) {
    return allKeyPairs.filter((keyPair) => keyPair.disabled === false);
  }
  return allKeyPairs;
};

export const addKeyPair = async (siteId: number, name: string): Promise<KeyPairDTO> => {
  const response = await adminServiceClient.post<KeyPairDTO>('/api/client_side_keypairs/add', {
    site_id: siteId,
    name,
  });
  return response.data;
};

export const updateKeyPair = async (
  subscriptionId: string,
  name: string,
  disabled: boolean = false
): Promise<KeyPairDTO> => {
  const response = await adminServiceClient.post<KeyPairDTO>('/api/client_side_keypairs/update', {
    subscription_id: subscriptionId,
    disabled,
    name,
  });
  return response.data;
};

export const addSite = async (
  name: string,
  description: string,
  types: string
): Promise<SiteCreationDTO> => {
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

const ParticipantUpdatePartial = ParticipantSchema.pick({
  siteId: true,
  types: true,
}).extend({
  types: z.array(ParticipantTypeSchema.pick({ id: true })),
});

export const setSiteClientTypes = async (
  participantUpdatePartial: z.infer<typeof ParticipantUpdatePartial>
): Promise<void> => {
  const adminTypes = mapClientTypesToAdminEnums(participantUpdatePartial.types).join(',');
  const response = await adminServiceClient.post('/api/site/set-types', null, {
    params: {
      id: participantUpdatePartial.siteId,
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

export const setSiteDomainNames = async (
  siteId: number,
  domainNames: string[]
): Promise<AdminSiteDTO> => {
  const response = await adminServiceClient.post(`/api/site/domain_names?=id=${siteId}`, {
    domain_names: domainNames,
  });
  return response.data;
};
