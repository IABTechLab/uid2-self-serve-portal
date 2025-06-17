import { composeStories } from '@storybook/react-webpack5';
import { render, screen } from '@testing-library/react';

import * as stories from './Notification.stories';

const { WithIcon, WithTitle, WithoutIconAndTitle } = composeStories(stories);

test('has icon rendered', async () => {
  // No actual way to tell because we don't load the image in Jest - this is to provide more examples of Jest using Storybook data
  render(<WithIcon />);
});

test('has title rendered', () => {
  render(<WithTitle />);
  const title = screen.getByTestId('notification-title');
  expect(title.textContent).toContain('An title');
});

test('has notification', () => {
  render(<WithoutIconAndTitle />);
  const notification = screen.getByTestId('notification');
  expect(notification.textContent).toContain('notification');
});
