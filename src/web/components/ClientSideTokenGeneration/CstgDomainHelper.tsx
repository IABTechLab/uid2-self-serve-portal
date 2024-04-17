import { parse } from 'tldts';

type DomainProps = {
  isIcann: boolean | null;
  isPrivate: boolean | null;
  domain?: string | null;
};

export const isValidDomain = (domainName: string) => {
  const domainProps: DomainProps = parse(domainName);
  return Boolean((domainProps.isIcann || domainProps.isPrivate) && domainProps.domain);
};

export const extractTopLevelDomain = (domainName: string) => {
  const topLevelDomain = parse(domainName).domain;
  if (topLevelDomain && topLevelDomain !== domainName) {
    return topLevelDomain;
  }
  return domainName;
};
