/* eslint-disable react/jsx-props-no-spreading */
import clsx from 'clsx';
import { FieldPathByValue, FieldValues, useController } from 'react-hook-form';

import { BaseInputProps, Input } from './Input';
import { withFormContext } from './withFormContext';

import './Input.scss';

function TextInputComponent<
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, String>
>({
  control,
  inputName,
  label,
  rules,
  className,
  ...rest
}: BaseInputProps<TFieldValues, TPath> & React.InputHTMLAttributes<HTMLInputElement>) {
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

export const TextInput = withFormContext({ inputComponent: TextInputComponent });
