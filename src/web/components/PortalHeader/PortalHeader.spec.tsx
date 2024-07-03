import { composeStories } from '@storybook/react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './PortalHeader.stories';

const { ValidEmailAddress, InvalidEmailAddress, NoEmailAddress } = composeStories(stories);

test('when the drop is clicked, a gravatar is displayed', async () => {
  const user = userEvent.setup();
  render(<ValidEmailAddress />);
  const button = await screen.findByRole('button');
  await user.click(button);
  const menu = await screen.findByRole('menu');
  const avatar = await within(menu).findByRole('img');
  expect(avatar).toHaveAttribute('src', expect.stringContaining('//www.gravatar.com/avatar/'));
});

test('when an invalid email address is provided, a home link is still displayed', async () => {
  render(<InvalidEmailAddress />);
  const link = await screen.findByRole('link');
  expect(link).toHaveAttribute('href', '/');
});

test('when no email is provided, the dropdown text shows that there is no logged in user', async () => {
  render(<NoEmailAddress />);
  const button = await screen.findByRole('button');
  expect(button).toHaveTextContent('Not logged in');
});
