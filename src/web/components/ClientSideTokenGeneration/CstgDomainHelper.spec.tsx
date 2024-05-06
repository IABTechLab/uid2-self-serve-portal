import { extractTopLevelDomain, isValidDomain } from './CstgDomainHelper';

const validDomainsList = ['test.com', 'https://test.com', 'http://test.com'];

describe('test domain helper functions', () => {
  describe('turn valid domains into root-level domains', () => {
    it.each(validDomainsList)('should return a root-level domain', (stringsList) => {
      expect(extractTopLevelDomain(stringsList)).toEqual('test.com');
    });
  });
  describe('validate domains', () => {
    it.each(['test.c', 'https://test', '', 't    st.com', 'test'])(
      'should check the domain is invalid',
      (stringsList) => {
        expect(isValidDomain(stringsList)).toEqual(false);
      }
    );
    it.each(validDomainsList)('should return the domain is valid', (stringList) => {
      expect(isValidDomain(stringList)).toEqual(true);
    });
  });
});
