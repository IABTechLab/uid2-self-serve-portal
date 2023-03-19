import { composeStories } from '@storybook/testing-react';
import { render, screen } from '@testing-library/react';

import * as stories from './Card.stories';

const { WithDescription, WithTitle, NoHeader } = composeStories(stories);

test('has title', async () => {
  render(<WithTitle />);
  const title = await screen.findByTestId('card-title');
  expect(title.textContent).toContain('Card Title');
});

test('has description', async () => {
  render(<WithDescription />);
  const description = await screen.findByTestId('card-description');
  expect(description.textContent).toContain('Here is the description');
});

test('without header', async () => {
  render(<NoHeader />);
  const title = screen.queryByTestId('card-description');
  expect(title).toBeNull();
});
