import { composeStories } from '@storybook/testing-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './SelectInput.stories';

const { WithLabel, WithValidation } = composeStories(stories);

describe('SelectInput', () => {
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
    userEvent.click(submitButton);
    expect(await screen.findByRole('alert')).not.toBeNull();

    await userEvent.click(screen.getByRole('combobox', { name: 'select' }));
    await userEvent.click(screen.getByRole('option', { name: 'Option 2' }));
    userEvent.click(submitButton);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
