import {
  camelCaseToSpaced,
  deduplicateStrings,
  formatStringsWithSeparator,
  formatUnixDate,
  getArticle,
  isAlphaNumericWithHyphenAndDot,
  isAlphaNumericWithUnderscore,
  isVowel,
  separateStringsList,
  sortStringsAlphabetically,
  validateEmail,
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

    const testStringsDuplicates = ['test3', 'test1', 'test2', 'test1', 'test2'];
    it('should return array sorted with duplicates beside each other', () => {
      expect(sortStringsAlphabetically(testStringsDuplicates)).toEqual([
        'test1',
        'test1',
        'test2',
        'test2',
        'test3',
      ]);
    });

    const testOneString = [['test'], ['t'], ['1test'], ['']];
    it.each(testOneString)('should return same array as given', (t) => {
      expect(sortStringsAlphabetically([t])).toEqual([t]);
    });

    const testEmptyArray: string[] = [];
    it('should return empty array', () => {
      expect(sortStringsAlphabetically(testEmptyArray)).toEqual(testEmptyArray);
    });

    const testStringsCamelcase = [
      ['testString', 'teststring'],
      ['teststring', 'testString'],
    ];
    it.each(testStringsCamelcase)('should return array sorted with upper case first', (a, b) => {
      expect(sortStringsAlphabetically([a, b])).toEqual(['testString', 'teststring']);
    });

    const testSpecialChars = [
      '!',
      '@',
      '#',
      '$',
      '%',
      '^',
      '&',
      '*',
      '(',
      ')',
      '+',
      '=',
      '-',
      '[',
      ']',
      ';',
      '.',
      '/',
      '{',
      '}',
      '|',
      ':',
      '<',
      '>',
      '?',
    ];
    it('should return sorted special characters array', () => {
      expect(sortStringsAlphabetically(testSpecialChars)).toEqual([
        '!',
        '#',
        '$',
        '%',
        '&',
        '(',
        ')',
        '*',
        '+',
        '-',
        '.',
        '/',
        ':',
        ';',
        '<',
        '=',
        '>',
        '?',
        '@',
        '[',
        ']',
        '^',
        '{',
        '|',
        '}',
      ]);
    });
  });

  it('should check if string is alphanumeric with hyphen and dot', () => {
    const emptyString = '';
    const lowercaseString = '-123456.abcd';
    const uppercaseString = '-123456.ABCD';
    const symbolString = '@123456..--';
    expect(isAlphaNumericWithHyphenAndDot(emptyString)).toEqual(false);
    expect(isAlphaNumericWithHyphenAndDot(lowercaseString)).toEqual(true);
    expect(isAlphaNumericWithHyphenAndDot(uppercaseString)).toEqual(true);
    expect(isAlphaNumericWithHyphenAndDot(symbolString)).toEqual(false);
  });

  it('should check if string is alphanumeric with underscore', () => {
    const emptyString = '';
    const lowercaseString = '_123456abcd';
    const uppercaseString = '123456_ABCD';
    const symbolString = '@123456__';
    expect(isAlphaNumericWithUnderscore(emptyString)).toEqual(false);
    expect(isAlphaNumericWithUnderscore(lowercaseString)).toEqual(true);
    expect(isAlphaNumericWithUnderscore(uppercaseString)).toEqual(true);
    expect(isAlphaNumericWithUnderscore(symbolString)).toEqual(false);
  });

  describe('check validate email', () => {
    const validTestEmails = [
      'email@example.com',
      'firstname.lastname@example.com',
      'email@subdomain.example.com',
      'firstname+lastname@example.com',
      'CAPITAL.TEST@EXAMPLE.com',
      'numbers012345test@example.com',
      '123numbersatbeginning@example.com',
      'email-with-hyphen@example.com',
      'validspecialcharacters!$#%&’*+-=/?^_{}|~@example.com',
      'plus+sign@example.com',
      '"quoted spaces"@example.com',
      'hei@やる.ca',
      'ÀÁÂÃÇüéâäàåçêëèïîìÄÅÉôöòûùÿÖÜ@example.com',
      'ÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞß@example.com',
      'þ÷×æÆ¢£¥₧ƒ@example.com',
    ];
    it.each(validTestEmails)('should return the email is valid', (email) => {
      expect(validateEmail(email)).toEqual(true);
    });

    const invalidTestEmails = [
      'toomany@@@@@example.com',
      'test',
      '123',
      'TEST',
      'test@non valid gmail.com',
      'email@123.123.123.123',
      'test@under_score.com',
      'test@-hyphen.com',
      'test@example...com',
      'test@example',
    ];
    it.each(invalidTestEmails)('should return the email is invalid', (email) => {
      expect(validateEmail(email)).toEqual(false);
    });
  });
  describe('check camelCaseToSpaced', () => {
    const tests = [
      { initial: 'camelCase', final: 'Camel Case' },
      { initial: 'camelcase', final: 'Camelcase' },
      { initial: 'camel Case', final: 'Camel Case' },
      { initial: 'camel case', final: 'Camel case' },
    ];
    it.each(tests)('should correctly convert camelCase to spaced and capitalized', (wordPair) => {
      expect(camelCaseToSpaced(wordPair.initial)).toEqual(wordPair.final);
    });
  });
});
