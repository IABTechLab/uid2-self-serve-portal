import { extractTopLevelDomain, getPagedDomains, isAppStoreId } from './CstgHelper';

const validDomainsList = ['test.com', 'https://test.com', 'http://test.com'];
const longDomainsList = [
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

describe('test domain helper functions', () => {
  describe('turn valid domains into root-level domains', () => {
    it.each(validDomainsList)('should return a root-level domain', (stringsList) => {
      expect(extractTopLevelDomain(stringsList)).toEqual('test.com');
    });
  });

  describe('filter correct paged domains', () => {
    it('should return a filtered first page domain list', () => {
      const pageNumber = 1;
      const rowsPerPage = 10;
      expect(getPagedDomains(longDomainsList, pageNumber, rowsPerPage)).toEqual(
        longDomainsList.filter((_, index) => index < pageNumber * rowsPerPage)
      );
    });
    it('should return a filtered domain list at the end less than the number of rows per page', () => {
      const pageNumber = 2;
      const rowsPerPage = 25;
      expect(getPagedDomains(longDomainsList, pageNumber, rowsPerPage)).toEqual(
        longDomainsList.filter(
          (_, index) => index >= (pageNumber - 1) * rowsPerPage && index < pageNumber * rowsPerPage
        )
      );
    });
    it('should return a filtered total domain list since rows per page is great than total', () => {
      const pageNumber = 1;
      const rowsPerPage = 50;
      expect(getPagedDomains(longDomainsList, pageNumber, rowsPerPage)).toEqual(longDomainsList);
    });
    it('should return an empty list', () => {
      const pageNumber = 0;
      const rowsPerPage = 10;
      expect(getPagedDomains(longDomainsList, pageNumber, rowsPerPage)).toEqual([]);
    });
  });
});

describe('test app id helper functions', () => {
  it('should check if app store id is valid', () => {
    const emptyString = '';
    const numericString = '123456';
    const alphabetString = 'abcdefd1234';
    const symbolString = '@123456';
    expect(isAppStoreId(emptyString)).toEqual(false);
    expect(isAppStoreId(numericString)).toEqual(true);
    expect(isAppStoreId(alphabetString)).toEqual(false);
    expect(isAppStoreId(symbolString)).toEqual(false);
  });
});
