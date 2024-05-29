import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';

import * as stories from './Banner.stories';

const { Info } = composeStories(stories);

test('has icon and message rendered', async () => {
  render(<Info />);
  const title = await screen.findByTestId('banner-message');
  expect(title.textContent).toContain(Info.args?.message);
  expect(screen.getByTestId('banner-icon')).toBeInTheDocument();
});
