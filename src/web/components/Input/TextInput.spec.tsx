import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TextInput } from './TextInput';
import * as stories from './TextInput.stories';

describe('TextInput', () => {
  it('verifies field based on rule', async () => {
    const user = userEvent.setup();
    render(<TextInput {...stories.WithValidation.args} inputName='textInput'/>);
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
