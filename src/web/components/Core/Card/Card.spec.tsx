import { composeStories } from '@storybook/react-webpack5';
import { render, screen } from '@testing-library/react';

import * as stories from './Card.stories';

const { WithDescription, WithTitle, NoHeader } = composeStories(stories);

test('has title', () => {
  render(<WithTitle />);
  const title = screen.getByTestId('card-title');
  expect(title.textContent).toContain('Card Title');
});

test('has description', () => {
  render(<WithDescription />);
  const description = screen.getByTestId('card-description');
  expect(description.textContent).toContain('Here is the description');
});

test('without header', async () => {
  render(<NoHeader />);
  const title = screen.queryByTestId('card-description');
  expect(title).toBeNull();
});
