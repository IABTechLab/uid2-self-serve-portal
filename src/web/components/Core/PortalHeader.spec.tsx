import { composeStories } from '@storybook/testing-react';
import { render, screen, within } from '@testing-library/react';

import * as stories from './PortalHeader.stories';

const { WithGravatar, InvalidEmailAddress } = composeStories(stories);

test('picks the right URL for the image', async () => {
  render(<WithGravatar />);
  // const button = await screen.findByRole('button');
  // TODO: Click the button, check the gravatar is there
});

test('invalid email address still renders home link', async () => {
  // No actual way to tell because we don't load the image in Jest - this is to provide more examples of Jest using Storybook data
  render(<InvalidEmailAddress />);
  const link = await screen.findByRole('link');
  expect(link).toHaveAttribute('href', '/');
});
