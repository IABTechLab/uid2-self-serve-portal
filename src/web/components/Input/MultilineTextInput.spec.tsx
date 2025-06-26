import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './MultilineTextInput.stories';
import { MultilineTextInput } from './MultilineTextInput';


describe('MultilineTextInput', () => {
  it('verifies field based on rule', async () => {
    const user = userEvent.setup();
    render(<MultilineTextInput {...stories.WithValidation.args} inputName='multilineTextInput'/>);
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await user.click(submitButton);
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Please enter some text.');

    await user.keyboard('123');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
