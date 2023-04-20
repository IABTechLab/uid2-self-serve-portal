import * as Label from '@radix-ui/react-label';
import { ReactNode } from 'react';
import { FieldError, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

import './Input.scss';

export type BaseInputProps<
  TFieldValues extends FieldValues,
  TPath extends FieldPath<TFieldValues>
> = {
  inputName: TPath;
  label?: string;
  rules?: Omit<
    RegisterOptions<TFieldValues, TPath>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
};

type InputProps = {
  inputName: string;
  label?: string;
  error?: FieldError;
  children: ReactNode;
};
export function Input({ inputName, label, error, children }: InputProps) {
  return (
    <div className='input-field' key={`${inputName}-input`}>
      {label && (
        <Label.Root className='input-label' htmlFor={inputName}>
          {label}
        </Label.Root>
      )}
      {children}
      {error && <span role='alert'>{error.message}</span>}
    </div>
  );
}
