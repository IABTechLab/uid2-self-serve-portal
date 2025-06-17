import { composeStories } from '@storybook/react-webpack5';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './MultilineTextInput.stories';

const { WithValidation } = composeStories(stories);

describe('MultilineTextInput', () => {
  it('verifies field based on rule', async () => {
    const user = userEvent.setup();
    render(<WithValidation />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await user.click(submitButton);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Please enter some text.');

    await user.keyboard('123');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
