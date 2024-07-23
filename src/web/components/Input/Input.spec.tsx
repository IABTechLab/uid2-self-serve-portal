import { render, screen } from '@testing-library/react';
import { FieldError } from 'react-hook-form';

import { Input } from './Input';

describe('Input', () => {
  it('renders correctly with label', () => {
    render(
      <Input inputName='input' label='InputLabel'>
        <input id='input' />
      </Input>
    );
    expect(screen.getByLabelText('InputLabel')).toBeInTheDocument();
  });

  it('displays validation error message', () => {
    render(
      <Input inputName='input' label='InputLabel' error={{ message: 'Some message' } as FieldError}>
        <input id='input' />
      </Input>
    );

    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Some message');
  });
});
