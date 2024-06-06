import { parse } from 'tldts';

import { RowsPerPageValues } from '../Core/PagingToolHelper';

export type UpdateDomainNamesResponse = {
  domains: string[];
  isValidDomains: boolean;
};

export const extractTopLevelDomain = (domainName: string) => {
  const topLevelDomain = parse(domainName).domain;
  if (topLevelDomain && topLevelDomain !== domainName) {
    return topLevelDomain;
  }
  return domainName;
};

export const getPagedDomains = (
  domains: string[],
  pageNumber: number,
  rowsPerPage: RowsPerPageValues
) => {
  return domains.filter(
    (_, index) =>
      index >= (pageNumber - 1) * rowsPerPage &&
      index < (pageNumber - 1) * rowsPerPage + rowsPerPage
  );
};

export const getUniqueDomains = (
  newDomains: string[],
  existingDomains: string[],
  deleteExistingList: boolean
) => {
  // filter out domain names that already exist in the list unless existing list is being deleted
  const uniqueDomains = deleteExistingList
    ? newDomains
    : newDomains.filter((domain) => !existingDomains?.includes(domain));
  return uniqueDomains;
};

export const getUniqueAppIds = (
  newAppIds: string[],
  existingAppIds: string[],
  deleteExistingList: boolean
) => {
  // filter out domain names that already exist in the list unless existing list is being deleted
  const uniqueAppIds = deleteExistingList
    ? newAppIds
    : newAppIds.filter((appId) => !existingAppIds?.includes(appId));
  return uniqueAppIds;
};
