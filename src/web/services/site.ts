import { SiteListResponse } from '../../api/services/adminServiceClient';
import { createSwrHook } from './SwrHelpers';

const swrHook = createSwrHook<SiteListResponse>(`/sites/`);
export const useSiteList = swrHook.hookFunction;
export const preloadSiteList = swrHook.preloadFunction;
export const TestSiteListProvider = swrHook.TestDataProvider;
