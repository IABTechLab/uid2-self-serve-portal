import {
  deduplicateStrings,
  formatStringsWithSeparator,
  formatUnixDate,
  getArticle,
  isVowel,
  separateStringsList,
  sortStrings,
} from './textHelpers';

describe('Text helper tests', () => {
  describe('vowel check', () => {
    it('should return that a lowercase vowel is true', () => {
      expect(isVowel('a')).toEqual(true);
    });
    it('should check is capital vowel valid', () => {
      expect(isVowel('E')).toEqual(true);
    });
    it('should return that consonant is invalid', () => {
      expect(isVowel('b')).toEqual(false);
    });
    it('should check that capital consonant is invalid', () => {
      expect(isVowel('C')).toEqual(false);
    });
  });

  describe('get article check', () => {
    it.each(['alpha', 'echo', 'india', 'oscar', 'uniform'])(
      'should return the correct article',
      (words) => {
        expect(getArticle(words)).toEqual('an');
      }
    );
    it.each(['bravo', 'golf', 'hotel', 'tango', 'yankee', ''])(
      'should return the correct article',
      (words) => {
        expect(getArticle(words)).toEqual('a');
      }
    );
  });

  describe('concatenate strings', () => {
    it('should return empty string', () => {
      expect(formatStringsWithSeparator([])).toEqual('');
    });
    it('should return single value', () => {
      expect(formatStringsWithSeparator(['test'])).toEqual('test');
    });
    it('should return two strings with and', () => {
      expect(formatStringsWithSeparator(['test', 'test2'])).toEqual('test and test2');
    });
    it('should return a comma separated list of strings with and at the end', () => {
      expect(formatStringsWithSeparator(['test', 'test2', 'test3', 'test4'])).toEqual(
        'test, test2, test3 and test4'
      );
    });
  });

  describe('format unix date', () => {
    it('should return correct unix date', () => {
      expect(formatUnixDate(1713306239)).toEqual('4/16/2024');
    });
  });

  describe('separate out comma separated list into string array', () => {
    it.each(['test1, test2, test3', 'test1,test2,test3', 'test1, test2,test3'])(
      'should return list of strings',
      (stringsList) => {
        expect(separateStringsList(stringsList)).toEqual(['test1', 'test2', 'test3']);
      }
    );
    it('should return single string array', () => {
      expect(separateStringsList('test')).toEqual(['test']);
    });
    it('should return empty array', () => {
      expect(separateStringsList('')).toEqual([]);
    });
  });

  describe('filter out duplicate elements', () => {
    const testStringArr = [['test1', 'test1'], ['test1'], ['test1', 'test1']];
    it.each(testStringArr)('should return array of only one unique element', () => {
      for (const t of testStringArr) {
        expect(deduplicateStrings(t)).toEqual(['test1']);
      }
    });
    const testStringArr2 = [
      ['test1', 'test1', 'test2'],
      ['test1', 'test2'],
      ['test1', 'test1', 'test2', 'test2'],
    ];
    it.each(testStringArr2)('should return array of only one unique element', () => {
      for (const t of testStringArr2) {
        expect(deduplicateStrings(t)).toEqual(['test1', 'test2']);
      }
    });
  });

  describe('sortstrings', () => {
    const testStringArr = [
      ['atest', 'btest', 'ctest'],
      ['btest', 'atest', 'ctest'],
      ['ctest', 'btest', 'atest'],
    ];
    it.each(testStringArr)('should return array sorted alphabetically', () => {
      for (const t of testStringArr) {
        expect(sortStrings(t)).toEqual(['atest', 'btest', 'ctest']);
      }
    });
  });
});
