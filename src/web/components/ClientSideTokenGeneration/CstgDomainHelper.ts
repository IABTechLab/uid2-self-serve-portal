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
