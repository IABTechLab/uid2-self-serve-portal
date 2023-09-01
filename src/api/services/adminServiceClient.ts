/* eslint-disable camelcase */
import axios from 'axios';

import { SSP_ADMIN_SERVICE_BASE_URL, SSP_ADMIN_SERVICE_CLIENT_KEY } from '../envars';
import { getLoggers } from '../helpers/loggingHelpers';

export type SharingListResponse = {
  allowed_sites: number[];
  allowed_types: ClientType[];
  hash: number;
};

const adminServiceClient = axios.create({
  baseURL: SSP_ADMIN_SERVICE_BASE_URL,
  headers: {
    common: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SSP_ADMIN_SERVICE_CLIENT_KEY}`,
    },
  },
});

export const getSharingList = async (siteId: number): Promise<SharingListResponse> => {
  try {
    const response = await adminServiceClient.get<SharingListResponse>(
      `/api/sharing/list/${siteId}`,
      {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
      }
    );
    // console.log(`/api/sharing/list/${siteId} response`, response);
    return response.status === 200
      ? response.data
      : {
          allowed_sites: [],
          allowed_types: [],
          hash: 0,
        };
  } catch (error: unknown) {
    const [logger] = getLoggers();
    logger.error(`Get ACLs failed: ${error}`);
    throw error;
  }
};

export const getSharingTypes = async (siteId: number): Promise<SharingListResponse> => {
  try {
    const response = await adminServiceClient.get<SharingListResponse>(
      `/api/sharing/list/${siteId}`,
      {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
      }
    );
    console.log(`--------- get /api/sharing/list/${siteId} response`, response);
    return response.status === 200
      ? response.data
      : {
          allowed_sites: [],
          allowed_types: [],
          hash: 0,
        };
  } catch (error: unknown) {
    const [logger] = getLoggers();
    logger.error(`Get ACLs failed: ${error}`);
    throw error;
  }
};

export const updateSharingList = async (
  siteId: number,
  hash: number,
  siteList: number[],
  typeList: string[]
): Promise<SharingListResponse> => {
  try {
    // console.log('-------- typeList', typeList);
    const response = await adminServiceClient.post<SharingListResponse>(
      `/api/sharing/list/${siteId}`,
      {
        allowed_sites: siteList,
        allowed_types: typeList,
        hash,
      },
      {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
      }
    );
    console.log(`--------- post /api/sharing/list/${siteId} response`, response);

    return response.status === 200
      ? response.data
      : {
          allowed_sites: [],
          allowed_types: [],
          hash: 0,
        };
  } catch (error: unknown) {
    const [logger] = getLoggers();
    logger.error(`Update ACLs failed: ${error}`);
    throw error;
  }
};

type ClientRole = 'ID_READER' | 'GENERATOR' | 'MAPPER' | 'OPTOUT' | 'SHARER';
export type ClientType = 'DSP' | 'ADVERTISER' | 'DATA_PROVIDER' | 'PUBLISHER';
export type SiteDTO = {
  id: number;
  name: string;
  enabled: boolean;
  roles: ClientRole[];
  types: ClientType[];
  client_count: number;
};

export const getSiteList = async () => {
  const response = await adminServiceClient.get<SiteDTO[]>('/api/site/list');
  return response.data;
};
