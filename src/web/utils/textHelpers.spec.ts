import {
  deduplicateStrings,
  formatStringsWithSeparator,
  formatUnixDate,
  getArticle,
  isVowel,
  separateStringsList,
  sortStringsAlphabetically,
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
      const unixTimestamp = 1713306239;
      const date = new Date(unixTimestamp * 1000);
      const dateString = date.toLocaleDateString();
      expect(formatUnixDate(unixTimestamp)).toEqual(dateString);
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
    const testStringArrs = [['test1', 'test1'], ['test1'], ['test1', 'test1']];
    testStringArrs.forEach((testStringArr) => {
      it('should return array of only one unique element', () => {
        expect(deduplicateStrings(testStringArr)).toEqual(['test1']);
      });
    });

    const testStringArrs2 = [
      ['test1', 'test1', 'test2'],
      ['test1', 'test2'],
      ['test1', 'test1', 'test2', 'test2'],
    ];
    testStringArrs2.forEach((testStringArr2) => {
      it('should return array of unique elements', () => {
        expect(deduplicateStrings(testStringArr2)).toEqual(['test1', 'test2']);
      });
    });
  });

  describe('sort strings alphabetically', () => {
    const testStringArr = [
      ['atest', 'btest', 'ctest'],
      ['btest', 'atest', 'ctest'],
      ['ctest', 'btest', 'atest'],
    ];
    it.each(testStringArr)('should return array sorted alphabetically', (a, b, c) => {
      expect(sortStringsAlphabetically([a, b, c])).toEqual(['atest', 'btest', 'ctest']);
    });

    const testStringArrNumbers = ['1test', '7test', '10test'];
    const testStringArrNumbers2 = ['test9', 'test90', 'test40'];
    it('should return array sorted alphabetically not numerically', () => {
      expect(sortStringsAlphabetically(testStringArrNumbers)).toEqual(['10test', '1test', '7test']);
      expect(sortStringsAlphabetically(testStringArrNumbers2)).toEqual([
        'test40',
        'test9',
        'test90',
      ]);
    });

    const testStringArrNumbers3 = [
      ['1', '2', '10'],
      ['1', '10', '2'],
      ['2', '1', '10'],
    ];
    it.each(testStringArrNumbers3)('should return array sorted alphabetically', (a, b, c) => {
      expect(sortStringsAlphabetically([a, b, c])).toEqual(['1', '10', '2']);
    });
  });
});
