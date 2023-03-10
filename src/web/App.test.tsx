import { render, screen } from '@testing-library/react';

import { TestContextProvider } from '../testHelpers/testContextProvider';
import { App } from './App';

test('renders the header', () => {
  render(
    <TestContextProvider>
      <App />
    </TestContextProvider>
  );
  const linkElement = screen.getByText(/Loading/i);
  expect(linkElement).toBeInTheDocument();
});
