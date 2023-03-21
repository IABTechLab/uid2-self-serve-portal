import { composeStories } from '@storybook/testing-react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './SelectInput.stories';

const { WithValidation } = composeStories(stories);

describe('SelectInput', () => {
  it('verifies field based on rule', async () => {
    render(<WithValidation />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('This field is required');

    userEvent.click(screen.getByRole('combobox', { name: 'select' }));
    await waitFor(async () => {
      const option = screen.getByRole('option', { name: 'Option 2' });
      expect(option).toBeInTheDocument();
    });
    userEvent.click(screen.getByRole('option', { name: 'Option 2' }));

    expect(screen.queryByRole('alert')).toBeNull();
  });
});
