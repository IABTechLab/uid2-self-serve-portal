import { render, screen } from '@testing-library/react';
import { Notification } from'./Notification';
import * as stories from './Notification.stories';

const { WithIcon, WithTitle, WithoutIconAndTitle } = stories;

test('has icon rendered', async () => {
  // No actual way to tell because we don't load the image in Jest - this is to provide more examples of Jest using Storybook data
  render(<Notification {...WithIcon.args} />);
});

test('has title rendered', () => {
  render(<Notification {...WithTitle.args} />);
  const title = screen.getByTestId('notification-title');
  expect(title.textContent).toContain('An title');
});

test('has notification', () => {
  render(<Notification {...WithoutIconAndTitle.args} />);
  const notification = screen.getByTestId('notification');
  expect(notification.textContent).toContain('notification');
});
