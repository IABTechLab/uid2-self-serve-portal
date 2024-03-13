import { composeStories } from '@storybook/testing-react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './TextInput.stories';

const { WithValidation } = composeStories(stories);

describe('TextInput', () => {
  it('verifies field based on rule', async () => {
    const user = userEvent.setup();
    render(<WithValidation />);
    const textInput = screen.getByTestId('text-input');
    await user.type(textInput, '123');
    await waitFor(async () => expect(await screen.findByDisplayValue('123')).toBeInTheDocument());

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Too many characters');

    await user.keyboard('[backspace]');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
