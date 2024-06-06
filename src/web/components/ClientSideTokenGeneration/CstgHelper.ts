import { parse } from 'tldts';

import {
  deduplicateStrings,
  isAlphaNumericWithHyphenAndDot,
  isJavaPackage,
} from '../../utils/textHelpers';
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

export const getPagedValues = (
  values: string[],
  pageNumber: number,
  rowsPerPage: RowsPerPageValues
) => {
  return values.filter(
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
  const dedupedAppIds = deduplicateStrings(newAppIds);
  // filter out app ids that already exist in the list unless existing list is being deleted
  const uniqueAppIds = deleteExistingList
    ? dedupedAppIds
    : dedupedAppIds.filter((appId) => !existingAppIds?.includes(appId));
  return uniqueAppIds;
};

export const isAndroidAppId = (value: string) => {
  return isJavaPackage(value);
};

export const isIOSBundleId = (value: string) => {
  return isAlphaNumericWithHyphenAndDot(value);
};

export const isAppStoreId = (value: string) => {
  if (value === '' || isNaN(Number(value))) {
    return false;
  }
  return true;
};

export const validateAppIds = (appIds: string[]): string[] => {
  const invalidAppIds: string[] = [];
  appIds.forEach((appId) => {
    if (!(isAppStoreId(appId) || isAndroidAppId(appId) || isIOSBundleId(appId))) {
      invalidAppIds.push(appId);
    }
  });
  return invalidAppIds;
};
