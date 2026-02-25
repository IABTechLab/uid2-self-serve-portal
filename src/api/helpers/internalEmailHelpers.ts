export const isUid2Engineer = (email: string) =>
  email.toLowerCase().endsWith('@unifiedid.com');

export const isTTDInternal = (email: string) =>
  email.toLowerCase().endsWith('@thetradedesk.com');

export const isUid2InternalEmail = (email: string) => {
  const lower = email.toLowerCase();
  return lower.endsWith('@unifiedid.com') || lower.endsWith('@thetradedesk.com');
};
