import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CreateStory } from '../../../testHelpers/storybookHelpers';
import * as stories from './TextInput.stories';

const { WithValidation } = stories;
const WithValidationStory = CreateStory(WithValidation);

describe('TextInput', () => {
  it('verifies field based on rule', async () => {
    const user = userEvent.setup();
    render(<WithValidationStory/>);
    const textInput = screen.getByTestId('text-input');
    await user.type(textInput, '123');
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Too many characters');

    await user.keyboard('[backspace]');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
