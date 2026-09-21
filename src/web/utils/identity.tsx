import { createContext, ReactNode, useContext, useMemo } from 'react';

export type IdentityConfig = {
  identity: 'UID2' | 'EUID';
  productName: string;
  docsBaseUrl: string;
  logo: { light: string; dark: string };
  isUid2: boolean;
  isEuid: boolean;
};

export type RawIdentityConfig = Omit<IdentityConfig, 'isUid2' | 'isEuid'>;

const IdentityContext = createContext<IdentityConfig | null>(null);

function IdentityConfigProvider({
  value,
  children,
}: Readonly<{ value: RawIdentityConfig; children: ReactNode }>) {
  const enriched = useMemo<IdentityConfig>(
    () => ({
      ...value,
      isUid2: value.identity === 'UID2',
      isEuid: value.identity === 'EUID',
    }),
    [value]
  );
  return <IdentityContext.Provider value={enriched}>{children}</IdentityContext.Provider>;
}

function useIdentityConfig(): IdentityConfig {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error('useIdentityConfig must be used inside IdentityConfigProvider');
  return ctx;
}

async function fetchIdentityConfig(): Promise<RawIdentityConfig> {
  const res = await fetch('/api/config');
  if (!res.ok) throw new Error(`/api/config returned ${res.status}`);
  return res.json() as Promise<RawIdentityConfig>;
}

export { fetchIdentityConfig, IdentityConfigProvider, useIdentityConfig };
