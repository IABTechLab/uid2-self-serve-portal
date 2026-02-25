export const isUid2Engineer = (email: string) =>
  email.toLowerCase().endsWith('@unifiedid.com');

export const isUid2Internal = (email: string) => {
  const lower = email.toLowerCase();
  return lower.endsWith('@unifiedid.com') || lower.endsWith('@thetradedesk.com');
};
