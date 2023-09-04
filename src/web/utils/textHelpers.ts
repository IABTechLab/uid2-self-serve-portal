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
