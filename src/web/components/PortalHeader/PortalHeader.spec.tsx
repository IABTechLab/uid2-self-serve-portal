import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';

import * as stories from './PortalHeader.stories';

const { InvalidEmailAddress, NoEmailAddress } = composeStories(stories);

describe('Portal Header tests', () => {
  test('when an invalid email address is provided, a home link is still displayed', async () => {
    render(<InvalidEmailAddress />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('/home'));
  });

  test('when no email is provided, the dropdown text shows that there is no logged in user', async () => {
    render(<NoEmailAddress />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Not logged in');
  });
});
