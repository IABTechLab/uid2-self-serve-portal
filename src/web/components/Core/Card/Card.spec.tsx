import { render, screen } from '@testing-library/react';

import { Card } from './Card';
import * as stories from './Card.stories';

const { WithDescription, WithTitle, NoHeader } = stories;

test('has title', () => {
  render(<Card {...WithTitle.args}> {'test'} </Card>);
  const title = screen.getByTestId('card-title');
  expect(title.textContent).toContain('Card Title');
});

test('has description', () => {
  render(<Card {...WithDescription.args}> {'test'} </Card>);
  const description = screen.getByTestId('card-description');
  expect(description.textContent).toContain('Here is the description');
});

test('without header', async () => {
  render(<Card {...NoHeader.args} />);
  const title = screen.queryByTestId('card-description');
  expect(title).toBeNull();
});
