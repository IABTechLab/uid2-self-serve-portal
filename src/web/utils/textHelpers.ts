export const isVowel = (letter: string): boolean =>
  ['a', 'e', 'i', 'o', 'u'].includes(letter.toLowerCase());

export const getArticle = (word: string): string => {
  const firstLetter = word.charAt(0);
  return isVowel(firstLetter) ? 'an' : 'a';
};

export const formatStringsWithSeparator = (strings: string[]): string => {
  if (strings.length === 2) {
    return strings.join(' and ');
  }
  if (strings.length > 2) {
    const lastCommaIndex = strings.length - 1;
    return `${strings.slice(0, lastCommaIndex).join(', ')} and ${strings[lastCommaIndex]}`;
  }
  return strings.length ? strings[0] : '';
};

const secondToMilliseconds = (timeValue: number) => timeValue * 1000;

export function formatUnixDate(timeValue: number) {
  const date = new Date(secondToMilliseconds(timeValue));
  return date.toLocaleDateString();
}

export const separateStringsList = (strings: string): string[] => {
  if (strings === '') return [];
  const stringsTrimmed = strings.replace(/, |,| {2}|\n|;|]|\[/gi, ' ').trim();
  return stringsTrimmed.split(/[ ]+/);
};

export const deduplicateStrings = (strings: string[]) => {
  return strings.filter((val, index, arr) => arr.indexOf(val) === index);
};

export const sortStringsAlphabetically = (strings: string[]) => {
  if (strings.length === 0 || strings.length === 1) {
    return strings;
  }
  return strings.sort((a: string, b: string) => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
};

export const validateEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const isAlphaNumericWithUnderscore = (s: string) => {
  if (s !== '' && s.match(/^[a-zA-Z0-9_]*$/)) {
    return true;
  }
  return false;
};

export const isAlphaNumericWithHyphenAndDot = (s: string) => {
  if (s !== '' && s.match(/^[a-zA-Z0-9-.]*$/)) {
    return true;
  }
  return false;
};

export const isAlpha = (s: string) => {
  if (s !== '' && s.match(/^[a-zA-Z]/)) {
    return true;
  }
  return false;
};
