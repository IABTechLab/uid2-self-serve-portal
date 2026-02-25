export const isUid2Engineer = (email: string) =>
  email.toLowerCase().endsWith('@unifiedid.com');

export const isTTDInternal = (email: string) =>
  email.toLowerCase().endsWith('@thetradedesk.com');
