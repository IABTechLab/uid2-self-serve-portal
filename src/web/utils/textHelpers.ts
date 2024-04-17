import { parse } from 'tldts';

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

export const separateStringsCommaSeparatedList = (strings: string): string[] => {
  if (strings === '') return [];
  const stringsList = strings.split(/, |,/);
  return stringsList;
};

export const extractTopLevelDomain = (domainName: string) => {
  const topLevelDomain = parse(domainName).domain;
  if (topLevelDomain && topLevelDomain !== domainName) {
    return topLevelDomain;
  }
  return domainName;
};
