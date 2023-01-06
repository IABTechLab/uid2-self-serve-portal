import { render, screen } from '@testing-library/react';
import React from 'react';

import { App } from './App';
import { TestContextProvider } from './testHelpers/testContextProvider';

test('renders the header', () => {
  render(
    <TestContextProvider>
      <App />
    </TestContextProvider>
  );
  const linkElement = screen.getByText(/UID2 Portal/i);
  expect(linkElement).toBeInTheDocument();
});
