import { SiteDTO } from '../../api/services/adminServiceClient';
import { createSwrHook } from './SwrHelpers';

const swrHook = createSwrHook<SiteDTO[]>(`/sites/`);
export const useSiteList = swrHook.hookFunction;
export const preloadSiteList = swrHook.preloadFunction;
export const TestSiteListProvider = swrHook.TestDataProvider;
