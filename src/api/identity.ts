type Identity = 'UID2' | 'EUID';

const KNOWN: readonly Identity[] = ['UID2', 'EUID'];

export function currentIdentity(): Identity {
  const raw = process.env.SSP_PORTAL_IDENTITY ?? 'UID2';
  if (!KNOWN.includes(raw as Identity)) {
    throw new Error(`SSP_PORTAL_IDENTITY must be one of ${KNOWN.join('|')} (got: ${raw})`);
  }
  return raw as Identity;
}

export const isUid2 = () => currentIdentity() === 'UID2';
export const isEuid = () => currentIdentity() === 'EUID';

export function productName(): string {
  return isEuid() ? 'EUID' : 'UID2';
}

export function docsBaseUrl(): string {
  return isEuid() ? 'https://euid.eu/docs/intro' : 'https://unifiedid.com/docs/intro';
}

export function keycloakRealm(): string {
  return isEuid() ? 'euid-self-serve-portal' : 'self-serve-portal';
}

export function logoAsset(variant: 'light' | 'dark' = 'light'): string {
  const suffix = variant === 'dark' ? '-darkmode' : '';
  return isEuid() ? `/euid-logo${suffix}.svg` : `/uid2-logo${suffix}.svg`;
}
