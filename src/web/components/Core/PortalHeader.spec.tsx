import { composeStories } from '@storybook/testing-react';
import { render, screen, within } from '@testing-library/react';

import * as stories from './PortalHeader.stories';

const { WithGravatar, InvalidEmailAddress } = composeStories(stories);

test('picks the right URL for the image', async () => {
  render(<WithGravatar />);
});

test('has default gravatar', async () => {
  // No actual way to tell because we don't load the image in Jest - this is to provide more examples of Jest using Storybook data
  render(<InvalidEmailAddress />);
  const link = await screen.findByTestId('title-link');
  const logo = within(link).getByRole('img') as HTMLImageElement;
  expect(logo.alt).toContain('UID2 logo');
});

test('has personal email address', async () => {
  render(<InvalidEmailAddress />);
  const link = await screen.findByTestId('title-link');
  const logo = within(link).getByRole('img') as HTMLImageElement;

  expect(logo.alt).toContain('UID2 logo');
});
