import { parse } from 'tldts';

import { isAlphaNumericWithHyphenAndDot, isJavaPackage } from '../../utils/textHelpers';
import { RowsPerPageValues } from '../Core/PagingToolHelper';

export type UpdateDomainNamesResponse = {
  domains: string[];
  isValidDomains: boolean;
};

export type UpdateAppNamesResponse = {
  appNames: string[];
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

export const isAndroidAppId = (value: string) => {
  return isJavaPackage(value);
};

export const isIOSBundleId = (value: string) => {
  return isAlphaNumericWithHyphenAndDot(value);
};

export const isAppStoreId = (value: string) => {
  if (isNaN(Number(value))) {
    return false;
  }
  return true;
};
