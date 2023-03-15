import { composeStories } from '@storybook/testing-react';
import { render, screen } from '@testing-library/react';

import * as stories from './Notification.stories';

const { WithIcon, WithTitle, WithoutIconAndTitle } = composeStories(stories);

test('has icon rendered', async () => {
  render(<WithIcon />);
});

test('has title rendered', async () => {
  // No actual way to tell because we don't load the image in Jest - this is to provide more examples of Jest using Storybook data
  render(<WithTitle />);
  const title = await screen.findByTestId('notification-title');
  expect(title.textContent).toContain('An title');
});

test('has notification', async () => {
  render(<WithoutIconAndTitle />);
  const notification = await screen.findByTestId('notification');
  expect(notification.textContent).toContain('notification');
});
