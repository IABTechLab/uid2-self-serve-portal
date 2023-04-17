/* eslint-disable react/jsx-props-no-spreading */
import clsx from 'clsx';
import { useContext } from 'react';
import { FieldPathByValue, FieldValues, RegisterOptions, useController } from 'react-hook-form';

import { FormContext, FormContextType } from '../Core/Form';
import { Input } from './Input';

import './Input.scss';

export function TextInput<
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, String>
>({
  inputName,
  label,
  rules,
  className,
  ...rest
}: {
  inputName: TPath;
  label: string;
  className?: string;
  rules?: Omit<
    RegisterOptions<TFieldValues, TPath>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const context = useContext(FormContext) as FormContextType<TFieldValues> | null;

  if (!context) {
    throw new Error('TextInput must be used within a FormContext.Provider');
  }

  const { control } = context;

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: inputName,
    rules,
  });
  const safeField = { ...field, value: field.value ?? '' }; // Ensure the value is never undefined

  return (
    <Input error={error} label={label} inputName={inputName}>
      <input
        className={clsx('input-container', { withError: error }, className)}
        {...safeField}
        aria-label={inputName}
        aria-invalid={error ? 'true' : 'false'}
        {...rest}
      />
    </Input>
  );
}
