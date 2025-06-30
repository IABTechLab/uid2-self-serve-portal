/* eslint-disable camelcase */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { z } from 'zod';

import { ParticipantSchema, ParticipantTypeSchema } from '../entities/Schemas';
import {
  SERVICE_INSTANCE_ID_PREFIX,
  SSP_ADMIN_SERVICE_BASE_URL,
  SSP_OKTA_AUTH_DISABLED,
  SSP_OKTA_AUTH_SERVER_URL,
  SSP_OKTA_CLIENT_ID,
  SSP_OKTA_CLIENT_SECRET,
} from '../envars';
import { getLoggers, TraceId } from '../helpers/loggingHelpers';
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

const createTracedClient = (traceId: TraceId) => {
  const instanceId = `${SERVICE_INSTANCE_ID_PREFIX}`;
  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      adminServiceClient.get<T>(url, {
        ...config,
        headers: {
          ...config?.headers,
          traceId: traceId.traceId,
          'uid-trace-id': traceId.uidTraceId,
          'uid-instance-id': instanceId,
        },
      }),
    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      adminServiceClient.post<T>(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          traceId: traceId.traceId,
          'uid-trace-id': traceId.uidTraceId,
          'uid-instance-id': instanceId,
        },
      }),
    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      adminServiceClient.put<T>(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          traceId: traceId.traceId,
          'uid-trace-id': traceId.uidTraceId,
          'uid-instance-id': instanceId,
        },
      }),
    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      adminServiceClient.delete<T>(url, {
        ...config,
        headers: {
          ...config?.headers,
          traceId: traceId.traceId,
          'uid-trace-id': traceId.uidTraceId,
          'uid-instance-id': instanceId,
        },
      }),
  };
};

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
  traceId: TraceId
): Promise<SharingListResponse> => {
  const client = createTracedClient(traceId);
  try {
    const response = await client.get<SharingListResponse>(`/api/sharing/list/${siteId}`);
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
  traceId: TraceId
): Promise<SharingListResponse> => {
  const client = createTracedClient(traceId);
  try {
    const response = await client.post<SharingListResponse>(`/api/sharing/list/${siteId}`, {
      allowed_sites: siteList,
      allowed_types: typeList,
      hash,
    });
    return response.data.allowed_sites
      ? response.data
      : { ...response.data, ...DEFAULT_SHARING_SETTINGS };
  } catch (error: unknown) {
    const { errorLogger } = getLoggers();
    errorLogger.error(`Update ACLs failed: ${error}`, traceId);
    throw error;
  }
};

export const getSiteList = async (traceId: TraceId): Promise<AdminSiteDTO[]> => {
  const client = createTracedClient(traceId);
  const response = await client.get<AdminSiteDTO[]>('/api/site/list');
  return response.data;
};

export const getSite = async (siteId: number, traceId: TraceId): Promise<AdminSiteDTO> => {
  const client = createTracedClient(traceId);
  const response = await client.get<AdminSiteDTO>(`/api/site/${siteId}`);
  return response.data;
};

export const getApiKeysBySite = async (
  siteId: number,
  traceId: TraceId
): Promise<ApiKeyAdmin[]> => {
  const client = createTracedClient(traceId);
  const response = await client.get<ApiKeyAdmin[]>(`/api/client/list/${siteId}`);
  return response.data;
};

export const getApiKeyById = async (keyId: string, traceId: TraceId): Promise<ApiKeyAdmin> => {
  const client = createTracedClient(traceId);
  const response = await client.get<ApiKeyAdmin>(`/api/client/keyId`, {
    params: { keyId },
  });
  return response.data;
};

export const renameApiKey = async (
  contact: string,
  newName: string,
  traceId: TraceId
): Promise<void> => {
  const client = createTracedClient(traceId);
  await client.post('/api/client/rename', null, {
    params: { contact, newName },
  });
};

export const updateApiKeyRoles = async (
  contact: string,
  apiRoles: string[],
  traceId: TraceId
): Promise<void> => {
  const client = createTracedClient(traceId);
  await client.post('/api/client/roles', null, {
    params: {
      contact,
      roles: apiRoles.join(', '),
    },
  });
};

export const disableApiKey = async (contact: string, traceId: TraceId): Promise<void> => {
  const client = createTracedClient(traceId);
  await client.post('/api/client/disable', null, {
    params: {
      contact,
    },
  });
};

export const getVisibleSiteList = async (traceId: TraceId): Promise<AdminSiteDTO[]> => {
  const client = createTracedClient(traceId);
  const siteList = await client.get<AdminSiteDTO[]>('/api/site/list');
  return siteList.data.filter((x) => x.visible !== false);
};

export const getKeyPairsList = async (
  siteId: number,
  traceId: TraceId,
  showDisabled?: boolean
): Promise<KeyPairDTO[]> => {
  const client = createTracedClient(traceId);
  try {
    const response = await client.get<KeyPairDTO[]>(`/api/v2/sites/${siteId}/client-side-keypairs`);
    const allKeyPairs = response.data;
    if (!showDisabled) {
      return allKeyPairs.filter(
        (keyPair) => keyPair.disabled === false && !keyPair.name?.includes('-disabled')
      );
    }
    return allKeyPairs;
  } catch (e: unknown) {
    if (e instanceof AxiosError && e?.response?.status === 404) {
      const message: unknown = e?.response?.data.message;
      if (typeof message === 'string' && message.includes('No keypairs available for site ID')) {
        return [];
      }
    }
    const { errorLogger } = getLoggers();
    errorLogger.error(`${e}`, traceId);
    throw e;
  }
};

export const addKeyPair = async (
  siteId: number,
  name: string,
  traceId: TraceId
): Promise<KeyPairDTO> => {
  const client = createTracedClient(traceId);
  const response = await client.post<KeyPairDTO>('/api/client_side_keypairs/add', {
    site_id: siteId,
    name,
  });
  return response.data;
};

export const updateKeyPair = async (
  subscriptionId: string,
  name: string,
  traceId: TraceId,
  disabled: boolean = false
): Promise<KeyPairDTO> => {
  const client = createTracedClient(traceId);
  const response = await client.post<KeyPairDTO>('/api/client_side_keypairs/update', {
    subscription_id: subscriptionId,
    disabled,
    name,
  });
  return response.data;
};

export const addSite = async (
  name: string,
  description: string,
  types: string,
  traceId: TraceId
): Promise<SiteCreationDTO> => {
  const client = createTracedClient(traceId);
  const response = await client.post<SiteCreationDTO>('/api/site/add', null, {
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
  participantUpdatePartial: z.infer<typeof ParticipantUpdatePartial>,
  traceId: TraceId
): Promise<void> => {
  const client = createTracedClient(traceId);
  const adminTypes = mapClientTypesToAdminEnums(participantUpdatePartial.types).join(',');
  await client.post('/api/site/set-types', null, {
    params: {
      id: participantUpdatePartial.siteId,
      types: adminTypes,
    },
  });
};

export const createApiKey = async (
  name: string,
  roles: string[],
  siteId: number,
  traceId: TraceId
): Promise<CreatedApiKeyDTO> => {
  const rolesString = roles.join(', ');
  const client = createTracedClient(traceId);
  const response = await client.post<CreatedApiKeyDTO>('/api/client/add', null, {
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
  domainNames: string[],
  traceId: TraceId
): Promise<AdminSiteDTO> => {
  const client = createTracedClient(traceId);
  const response = await client.post<AdminSiteDTO>(`/api/site/domain_names?=id=${siteId}`, {
    domain_names: domainNames,
  });
  return response.data;
};

export const setSiteAppNames = async (
  siteId: number,
  appNames: string[],
  traceId: TraceId
): Promise<AdminSiteDTO> => {
  const client = createTracedClient(traceId);
  const response = await client.post<AdminSiteDTO>(`/api/site/app_names?=id=${siteId}`, {
    app_names: appNames,
  });
  return response.data;
};
