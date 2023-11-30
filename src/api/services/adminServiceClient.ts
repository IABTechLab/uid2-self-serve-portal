/* eslint-disable camelcase */
import axios from 'axios';

import { SSP_ADMIN_SERVICE_BASE_URL, SSP_ADMIN_SERVICE_CLIENT_KEY } from '../envars';
import { getLoggers } from '../helpers/loggingHelpers';
import { ClientType, KeyPairDTO, SharingListResponse, SiteDTO } from './adminServiceHelpers';

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
    errorLogger.error(`Get ACLs failed: ${error}`, traceId);
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

export const getSiteList = async (): Promise<SiteDTO[]> => {
  const response = await adminServiceClient.get<SiteDTO[]>('/api/site/list');
  return response.data;
};

export const getVisibleSiteList = async (): Promise<SiteDTO[]> => {
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
