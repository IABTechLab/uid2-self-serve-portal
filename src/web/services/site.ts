import axios from 'axios';

import { AvailableParticipantDTO } from '../../api/routers/participantsRouter';
import { SiteDTO } from '../../api/services/adminServiceHelpers';
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
    const result = await axios.get<AvailableParticipantDTO[]>(availableEndpoint);
    return result.data;
  } catch {
    return [];
  }
};

const availableSiteSwrHook = createSwrHook<AvailableParticipantDTO[]>(
  availableEndpoint,
  availableSiteFetcher
);
export const useAvailableSiteList = availableSiteSwrHook.hookFunction;
export const preloadAvailableSiteList = availableSiteSwrHook.preloadFunction;
export const TestAvailableSiteListProvider = availableSiteSwrHook.TestDataProvider;
