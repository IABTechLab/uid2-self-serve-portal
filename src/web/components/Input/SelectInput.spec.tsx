import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WithValidationStory } from './SelectInput.stories';

describe('SelectInput', () => {
  it('verifies field based on rule', async () => {
    const user = userEvent.setup();
    render(<WithValidationStory />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('This field is required');

    await user.click(screen.getByRole('combobox', { name: 'select' }));
    await waitFor(async () => {
      const option = screen.getByRole('option', { name: 'Option 2' });
      expect(option).toBeInTheDocument();
    });
    await user.click(screen.getByRole('option', { name: 'Option 2' }));

    expect(screen.queryByRole('alert')).toBeNull();
  });
});
