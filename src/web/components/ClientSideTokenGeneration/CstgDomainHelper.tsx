type DomainProps = {
  isIcann: boolean | null;
  isPrivate: boolean | null;
  domain: string | null;
};

type ValidDomainProps = Omit<DomainProps, 'domain'> & { domain: string };

export const isValidDomain = (domainProps: DomainProps): domainProps is ValidDomainProps => {
  return Boolean((domainProps.isIcann || domainProps.isPrivate) && domainProps.domain);
};

export const isDuplicateDomain = (domain: string, existingDomainNames: string[]) => {
  return existingDomainNames.includes(domain);
};
