import { composeStories } from '@storybook/testing-react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './RadioInput.stories';

const { WithValidation } = composeStories(stories);

describe('RadioInput', () => {
  it('verifies field based on rule', async () => {
    render(<WithValidation />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('This field is required');

    userEvent.click(screen.getByRole('radio', { name: 'Option 2' }));
    await waitFor(() => {
      const option2Radio = screen.getByLabelText('Option 2');
      expect(option2Radio).toBeChecked();
    });
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
