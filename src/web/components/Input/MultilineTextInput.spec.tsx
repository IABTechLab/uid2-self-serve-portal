import { composeStories } from '@storybook/testing-react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './MultilineTextInput.stories';

const { WithValidation } = composeStories(stories);

describe('MultilineTextInput', () => {
  it('verifies field based on rule', async () => {
    const user = userEvent.setup();
    render(<WithValidation />);
    const textInput = screen.getByTestId('multiline-text-input');
    // await user.type(textInput, '');
    await waitFor(async () => expect(await screen.findByDisplayValue('')).toBeInTheDocument());

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Please enter some text.');

    await user.keyboard('123');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
