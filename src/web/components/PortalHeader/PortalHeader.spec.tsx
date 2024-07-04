import { composeStories } from '@storybook/react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './PortalHeader.stories';

const { ValidEmailAddress, InvalidEmailAddress, NoEmailAddress } = composeStories(stories);

test('when the drop is clicked, a gravatar is displayed', async () => {
  const user = userEvent.setup();
  render(<ValidEmailAddress />);
  const button = screen.getByRole('button');
  await user.click(button);
  const menu = screen.getByRole('menu');
  const avatar = within(menu).getByRole('img');
  expect(avatar).toHaveAttribute('src', expect.stringContaining('//www.gravatar.com/avatar/'));
});

test('when an invalid email address is provided, a home link is still displayed', async () => {
  render(<InvalidEmailAddress />);
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', '/');
});

test('when no email is provided, the dropdown text shows that there is no logged in user', async () => {
  render(<NoEmailAddress />);
  const button = screen.getByRole('button');
  expect(button).toHaveTextContent('Not logged in');
});
