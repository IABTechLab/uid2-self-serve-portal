/* eslint-disable testing-library/no-unnecessary-act */
import { composeStories } from '@storybook/testing-react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './RadioInput.stories';

const { WithLabel, WithValidation } = composeStories(stories);

describe('RadioInput', () => {
  it('renders correctly with label', () => {
    render(<WithLabel />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('displays validation error message', async () => {
    render(<WithValidation />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('This field is required');
  });

  it('clears error message when input is valid', async () => {
    render(<WithValidation />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await act(async () => {
      await userEvent.click(screen.getByRole('radio', { name: 'Option 2' }));
    });
    const option2Radio = screen.getByLabelText('Option 2');
    expect(option2Radio).toBeChecked();

    userEvent.click(submitButton);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
