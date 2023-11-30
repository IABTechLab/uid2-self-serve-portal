/* eslint-disable camelcase */
import axios, { AxiosError } from 'axios';
import { z } from 'zod';

import { ParticipantApprovalPartial } from '../entities/Participant';
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

const mapClientTypesToAdminEnums = (
  participantApprovalPartial: z.infer<typeof ParticipantApprovalPartial>
): string[] => {
  return participantApprovalPartial.types.map((type) => {
    let adminEnum = 'UNKNOWN';
    switch (type.id) {
      case 1:
        adminEnum = 'DSP';
        break;
      case 2:
        adminEnum = 'ADVERTISER';
        break;
      case 3:
        adminEnum = 'DATA_PROVIDER';
        break;
      case 4:
        adminEnum = 'PUBLISHER';
        break;
    }
    return adminEnum;
  });
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
  traceId: string,
  disabled: boolean = false
): Promise<KeyPairDTO> => {
  try {
    const response = await adminServiceClient.post<KeyPairDTO>('/api/client_side_keypairs/add', {
      site_id: siteId,
      disabled,
      name,
    });
    return response.data;
  } catch (error: unknown) {
    const { errorLogger } = getLoggers();
    let errorMessage = error;
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data.message as string;
    }
    errorLogger.error(`Get ACLs failed: ${errorMessage}`, traceId);
    throw error;
  }
};

export const setSiteClientTypes = async (
  participantApprovalPartial: z.infer<typeof ParticipantApprovalPartial>,
  traceId: string
): Promise<void> => {
  const adminTypes = mapClientTypesToAdminEnums(participantApprovalPartial).join(',');
  try {
    const response = await adminServiceClient.post('/api/site/set-types', null, {
      params: {
        id: participantApprovalPartial.siteId,
        types: adminTypes,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const { errorLogger } = getLoggers();
    let errorMessage = error;
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data.message as string;
    }
    errorLogger.error(`Update site client types failed: ${errorMessage}`, traceId);
    throw error;
  }
};
