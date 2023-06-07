import { composeStories } from '@storybook/testing-react';
import { render, screen } from '@testing-library/react';

import * as stories from './Banner.stories';

const { WithInfoMessage } = composeStories(stories);

test('has icon and message rendered', async () => {
  render(<WithInfoMessage />);
  const title = await screen.findByTestId('banner-message');
  expect(title.textContent).toContain('here is a banner');
  expect(screen.getByTestId('banner-icon')).toBeInTheDocument();
});
