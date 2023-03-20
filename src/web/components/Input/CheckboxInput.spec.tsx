/* eslint-disable testing-library/no-unnecessary-act */
import { composeStories } from '@storybook/testing-react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './CheckboxInput.stories';

const { WithLabel, WithValidation } = composeStories(stories);

describe('CheckboxInput', () => {
  it('renders correctly with label', () => {
    render(<WithLabel />);
    expect(screen.getByText('Select options')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('displays validation error message', async () => {
    render(<WithValidation />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('At least two options are required');
  });

  it('clears error message when input is valid', async () => {
    render(<WithValidation />);
    await act(async () => {
      await userEvent.click(screen.getByRole('checkbox', { name: 'Option 2' }));
    });
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);
    expect(await screen.findByRole('alert')).not.toBeNull();

    await act(async () => {
      await userEvent.click(screen.getByRole('checkbox', { name: 'Option 3' }));
    });
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
