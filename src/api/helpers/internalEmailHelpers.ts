export const isUid2Engineer = (email: string) =>
  email.toLowerCase().endsWith('@unifiedid.com');

/** Internal = MFA not required in Keycloak; used for attribute and app logic. */
export const isUid2Internal = (email: string) => {
  const lower = email.toLowerCase();
  return (
    lower.endsWith('@unifiedid.com') ||
    lower.endsWith('@tradedesk.com') ||
    lower.endsWith('@thetradedesk.com')
  );
};
