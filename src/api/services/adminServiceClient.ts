import axios from 'axios';

import { SSP_ADMIN_SERVICE_BASE_URL, SSP_ADMIN_SERVICE_CLIENT_KEY } from '../envars';
import { getLoggers } from '../helpers/loggingHelpers';

type SharingListResponse = {
  whiteList: number[];
  whitelist_hash: number;
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
    return await adminServiceClient.get(`/api/sharing/list/${siteId}`);
  } catch (error: unknown) {
    const [logger] = getLoggers();
    logger.error(`Get ACLs failed: ${error}`);
    throw error;
  }
};

export const updateSharingList = async (
  siteId: number,
  whiteListHash: number,
  sharingList: number[]
): Promise<SharingListResponse> => {
  try {
    return await adminServiceClient.post(`/api/sharing/list/${siteId}`, {
      whitelist: sharingList,
      // eslint-disable-next-line camelcase
      whitelist_hash: whiteListHash,
    });
  } catch (error: unknown) {
    const [logger] = getLoggers();
    logger.error(`Update ACLs failed: ${error}`);
    throw error;
  }
};
