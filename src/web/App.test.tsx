import { render, screen } from '@testing-library/react';

import { TestContextProvider } from '../testHelpers/testContextProvider';
import { App } from './App';

beforeEach(() => {
  // App now calls fetchIdentityConfig() in a useEffect. Stub fetch so the test
  // doesn't depend on the real network and the unresolved promise is harmless.
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          identity: 'UID2',
          productName: 'UID2',
          docsBaseUrl: 'https://unifiedid.com/docs/intro',
          logo: { light: '/uid2-logo.svg', dark: '/uid2-logo-darkmode.svg' },
        }),
    })
  ) as unknown as typeof fetch;
});

afterEach(() => {
  (global.fetch as jest.Mock | undefined)?.mockRestore?.();
});

test('renders the header', () => {
  render(
    <TestContextProvider>
      <App />
    </TestContextProvider>
  );
  const linkElement = screen.getByText(/Loading/i);
  expect(linkElement).toBeInTheDocument();
});
