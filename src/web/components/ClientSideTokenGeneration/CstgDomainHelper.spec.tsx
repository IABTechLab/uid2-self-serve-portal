import { extractTopLevelDomain, getPagedDomains, isValidDomain } from './CstgDomainHelper';

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

  describe('filter correct paged domains', () => {
    const domainsList = [
      'test.com',
      'test2.com',
      'test3.com',
      'test4.com',
      'test5.com',
      'test6.com',
      'test7.com',
      'test8.com',
      'test9.com',
      'test10.com',
      'test11.com',
      'test12.com',
      'test13.com',
      'test14.com',
      'test15.com',
      'test16.com',
      'test17.com',
      'test18.com',
      'test19.com',
      'test20.com',
      'test21.com',
      'test22.com',
      'test23.com',
      'test24.com',
      'test25.com',
      'test26.com',
      'test27.com',
      'test28.com',
      'test29.com',
    ];
    it('should return a filtered first page domain list', () => {
      expect(getPagedDomains(domainsList, 1, 10)).toEqual([
        'test.com',
        'test2.com',
        'test3.com',
        'test4.com',
        'test5.com',
        'test6.com',
        'test7.com',
        'test8.com',
        'test9.com',
        'test10.com',
      ]);
    });
    it('should return a filtered domain list at the end', () => {
      expect(getPagedDomains(domainsList, 2, 25)).toEqual([
        'test26.com',
        'test27.com',
        'test28.com',
        'test29.com',
      ]);
    });
    it('should return a filtered total domain list', () => {
      expect(getPagedDomains(domainsList, 1, 250)).toEqual(domainsList);
    });
    it('should return an empty list', () => {
      expect(getPagedDomains(domainsList, 0, 10)).toEqual([]);
    });
  });
});
