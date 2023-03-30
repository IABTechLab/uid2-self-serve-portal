import { composeStories } from '@storybook/testing-react';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './CheckboxInput.stories';

const { WithValidation } = composeStories(stories);

describe('CheckboxInput', () => {
  it('verifies field based on rule', async () => {
    render(<WithValidation />);

    userEvent.click(screen.getByRole('checkbox', { name: 'Option 2' }));
    await waitFor(() => {
      const option2 = screen.getByLabelText('Option 2');
      expect(option2).toBeChecked();
    });
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButton);
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('At least two options are required');

    userEvent.click(screen.getByRole('checkbox', { name: 'Option 3' }));
    await waitForElementToBeRemoved(screen.queryByRole('alert'));
  });
});
