import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

import { IdentityConfigProvider, useIdentityConfig } from './identity';

type RawConfig = Parameters<typeof IdentityConfigProvider>[0]['value'];

function wrap(config: RawConfig) {
  return function Wrapper({ children }: Readonly<{ children: ReactNode }>) {
    return <IdentityConfigProvider value={config}>{children}</IdentityConfigProvider>;
  };
}

describe('useIdentityConfig', () => {
  it('exposes the provided config', () => {
    const { result } = renderHook(() => useIdentityConfig(), {
      wrapper: wrap({
        identity: 'EUID',
        productName: 'EUID',
        docsBaseUrl: 'https://euid.eu/docs/intro',
        logo: { light: '/euid-logo.svg', dark: '/euid-logo-darkmode.svg' },
      }),
    });
    expect(result.current.productName).toBe('EUID');
    expect(result.current.isEuid).toBe(true);
  });

  it('throws when used outside provider', () => {
    // Silence the expected React error output for the throwing render.
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useIdentityConfig())).toThrow(/IdentityConfigProvider/);
    errorSpy.mockRestore();
  });
});
