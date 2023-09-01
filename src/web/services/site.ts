import axios from 'axios';

import { AvailableParticipantDTO } from '../../api/routers/participantsRouter';
import { SiteDTO } from '../../api/services/adminServiceHelpers';
import { createSwrHook } from './SwrHelpers';

// TODO fix this so approvals works
const endpoint = `/sites/`;
const fetcher = async () => {
  try {
    const result = await axios.get<SiteDTO[]>(endpoint);
    return result.data;
  } catch {
    return [];
  }
};
const swrHook = createSwrHook<SiteDTO[]>(`${endpoint}/unattached/`, fetcher);
export const useSiteList = swrHook.hookFunction;
export const preloadSiteList = swrHook.preloadFunction;
export const TestSiteListProvider = swrHook.TestDataProvider;

const availableSiteFetcher = async () => {
  try {
    const result = await axios.get<AvailableParticipantDTO[]>(`${endpoint}/available`);
    return result.data;
  } catch {
    return [];
  }
};

const availableSiteSwrHook = createSwrHook<AvailableParticipantDTO[]>(
  `${endpoint}/available`,
  availableSiteFetcher
);
export const useAvailableSiteList = availableSiteSwrHook.hookFunction;
export const preloadAvailableSiteList = availableSiteSwrHook.preloadFunction;
export const TestAvailableSiteListProvider = availableSiteSwrHook.TestDataProvider;
