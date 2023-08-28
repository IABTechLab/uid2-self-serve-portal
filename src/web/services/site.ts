import axios from 'axios';

import { SiteDTO } from '../../api/services/adminServiceHelpers';
import { createSwrHook } from './SwrHelpers';

const endpoint = `/sites/unattached/`;
const fetcher = async () => {
  try {
    const result = await axios.get<SiteDTO[]>(endpoint);
    return result.data;
  } catch {
    return [];
  }
};
const swrHook = createSwrHook<SiteDTO[]>(endpoint, fetcher);
export const useSiteList = swrHook.hookFunction;
export const preloadSiteList = swrHook.preloadFunction;
export const TestSiteListProvider = swrHook.TestDataProvider;
