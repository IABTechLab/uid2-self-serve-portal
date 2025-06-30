import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CreateStory } from '../../../testHelpers/storybookHelpers';
import * as stories from './RadioInput.stories';

const { WithValidation, WithLabel } = stories;
const WithValidationStory = CreateStory(WithValidation);
const WithLabelStory = CreateStory(WithLabel);

describe('RadioInput', () => {
  it('verifies field based on rule', async () => {
    const user = userEvent.setup();

    render(<WithValidationStory />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('This field is required');

    await userEvent.click(screen.getByRole('radio', { name: 'Option 2' }));
    const option2Radio = screen.getByLabelText('Option 2');
    expect(option2Radio).toBeChecked();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('verifies radio button is disabled', async () => {
    render(<WithLabelStory />);
    await userEvent.click(screen.getByRole('radio', { name: 'Option 4' }));
    const option2Radio = screen.getByLabelText('Option 4');
    expect(option2Radio).not.toBeChecked();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
