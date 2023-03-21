import { composeStories } from '@storybook/testing-react';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './TextInput.stories';

const { WithValidation } = composeStories(stories);

describe('TextInput', () => {
  it('verifies field based on rule', async () => {
    render(<WithValidation />);
    const textInput = screen.getByTestId('text-input');
    userEvent.type(textInput, '123');
    await waitFor(async () => expect(await screen.findByDisplayValue('123')).toBeInTheDocument());

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Too many characters');

    userEvent.keyboard('[backspace]');
    await waitForElementToBeRemoved(screen.queryByRole('alert'));
  });
});
