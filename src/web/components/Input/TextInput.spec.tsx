import { composeStories } from '@storybook/testing-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './TextInput.stories';

const { WithLabel, WithValidation } = composeStories(stories);

describe('TextInput', () => {
  it('renders correctly with label', () => {
    render(<WithLabel />);
    expect(screen.getByLabelText('textInput')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('displays validation error message', async () => {
    render(<WithValidation />);
    const textInput = screen.getByTestId('text-input');
    await userEvent.type(textInput, '123');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Too many characters');
  });

  it('clears error message when input is valid', async () => {
    render(<WithValidation />);
    const textInput = screen.getByTestId('text-input');
    await userEvent.type(textInput, '123');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);
    expect(await screen.findByRole('alert')).not.toBeNull();

    await userEvent.clear(textInput);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
