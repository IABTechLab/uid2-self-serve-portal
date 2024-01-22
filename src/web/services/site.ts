import axios from 'axios';

import { SharingSiteDTO } from '../../api/helpers/siteConvertingHelpers';
import { SiteAdmin, SiteDTO } from '../../api/services/adminServiceHelpers';
import { createSwrHook } from './SwrHelpers';

const unattachedEndpoint = `/sites/unattached/`;
const fetcher = async () => {
  try {
    const result = await axios.get<SiteDTO[]>(unattachedEndpoint);
    return result.data;
  } catch {
    return [];
  }
};
const swrHook = createSwrHook<SiteDTO[]>(unattachedEndpoint, fetcher);
export const useSiteList = swrHook.hookFunction;
export const preloadSiteList = swrHook.preloadFunction;
export const TestSiteListProvider = swrHook.TestDataProvider;

const availableEndpoint = `/sites/available`;
const availableSiteFetcher = async () => {
  try {
    const result = await axios.get<SharingSiteDTO[]>(availableEndpoint);
    return result.data;
  } catch {
    return [];
  }
};

const availableSiteSwrHook = createSwrHook<SharingSiteDTO[]>(
  availableEndpoint,
  availableSiteFetcher
);
export const useAvailableSiteList = availableSiteSwrHook.hookFunction;
export const preloadAvailableSiteList = availableSiteSwrHook.preloadFunction;
export const TestAvailableSiteListProvider = availableSiteSwrHook.TestDataProvider;

const allSitesEndpoint = `/sites/`;
const allSitesFetcher = async () => {
  try {
    const result = await axios.get<SharingSiteDTO[]>(allSitesEndpoint);
    return result.data;
  } catch {
    return [];
  }
};

const allSitesSwrHook = createSwrHook<SharingSiteDTO[]>(allSitesEndpoint, allSitesFetcher);
export const useAllSitesList = allSitesSwrHook.hookFunction;
export const preloadAllSitesList = allSitesSwrHook.preloadFunction;
export const TestAllSitesListProvider = allSitesSwrHook.TestDataProvider;
