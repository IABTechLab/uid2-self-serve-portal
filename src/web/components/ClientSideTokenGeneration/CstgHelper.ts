import { parse } from 'tldts';

import {
  deduplicateStrings,
  isAlpha,
  isAlphaNumericWithHyphenAndDot,
  isAlphaNumericWithUnderscore,
} from '../../utils/textHelpers';
import { RowsPerPageValues } from '../Core/Paging/PagingToolHelper';

export type UpdateCstgValuesResponse = {
  cstgValues: string[];
  isValidCstgValues: boolean;
};

export type AddCstgValuesFormProps = {
  cstgValues: string;
};

export type EditCstgValuesFormProps = {
  cstgValue: string;
};

export enum CstgValueType {
  Domain = 'Root-Level Domain',
  MobileAppId = 'Mobile App ID',
}

export const formatCstgValueType = (valueType: CstgValueType) => {
  switch (valueType) {
    case CstgValueType.Domain:
      return 'root-level domain';
    case CstgValueType.MobileAppId:
      return 'mobile app ID';
    default:
      return valueType;
  }
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

export const getUniqueCstgValues = (
  newCstgValues: string[],
  existingCstgValues: string[],
  deleteExistingList: boolean
) => {
  const dedupedCstgValues = deduplicateStrings(newCstgValues);
  // filter out values that already exist in the list unless existing list is being deleted
  const uniqueCstgValues = deleteExistingList
    ? dedupedCstgValues
    : dedupedCstgValues.filter((value) => !existingCstgValues?.includes(value));
  return uniqueCstgValues;
};

// Source: https://developer.android.com/build/configure-app-module
// id must have at least 2 dots
// every character in between the dots must be alphanumeric
// the first character of each segment must be a letter
export const isAndroidAppId = (value: string) => {
  const segments = value.split('.');
  const dotCount = segments.length - 1;
  if (dotCount < 2) {
    return false;
  }

  return segments.every((s) => isAlphaNumericWithUnderscore(s) && isAlpha(s[0]));
};

// Source: https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier
// "bundle ID string must contain only alphanumeric characters (A–Z, a–z, and 0–9), hyphens (-), and periods (.)"
export const isIOSBundleId = (value: string) => {
  return isAlphaNumericWithHyphenAndDot(value);
};

// Source: https://support.google.com/admob/answer/10038409?hl=en
// "For example, the URL of an app page is apps.apple.com/us/app/example/id000000000. The app's store ID is 000000000"
export const isAppStoreId = (value: string) => {
  if (value === '' || isNaN(Number(value))) {
    return false;
  }
  return true;
};

export const validateAppId = (appId: string): boolean => {
  return isAppStoreId(appId) || isAndroidAppId(appId) || isIOSBundleId(appId);
};
