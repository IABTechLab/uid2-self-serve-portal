import { composeStories } from '@storybook/testing-react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './TextInput.stories';

const { WithLabel, WithValidation } = composeStories(stories);

describe('TextInput', () => {
  it('renders correctly with label', () => {
    render(<WithLabel />);
    expect(screen.getByLabelText('textInput')).toBeInTheDocument();
  });

  it('displays validation error message', async () => {
    render(<WithValidation />);
    const textInput = screen.getByTestId('text-input');
    userEvent.type(textInput, '123');
    await waitFor(async () => expect(await screen.findByDisplayValue('123')).toBeInTheDocument());

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Too many characters');
  });

  it('clears error message when input is valid', async () => {
    render(<WithValidation />);
    const textInput = screen.getByTestId('text-input');
    userEvent.type(textInput, '123');
    await waitFor(async () => expect(await screen.findByDisplayValue('123')).toBeInTheDocument());

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);
    expect(await screen.findByRole('alert')).not.toBeNull();

    userEvent.keyboard('[backspace]');
    await waitForElementToBeRemoved(screen.queryByRole('alert'));
  });
});
