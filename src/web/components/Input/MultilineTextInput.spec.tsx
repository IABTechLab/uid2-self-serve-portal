import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { WithValidation } from './MultilineTextInput.stories';
import { CreateStory } from '../../../testHelpers/storybookHelpers';

const WithValidationStory = CreateStory(WithValidation);

describe('MultilineTextInput', () => {
  it('verifies field based on rule', async () => {
    const user = userEvent.setup();
    render(<WithValidationStory />);
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await user.click(submitButton);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Please enter some text.');

    await user.keyboard('123');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
