/* eslint-disable react/jsx-props-no-spreading */
import clsx from 'clsx';
import {
  Control,
  FieldPathByValue,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form';

import { Input } from './Input';

import './Input.scss';

export function TextInput<
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, String>
>({
  control,
  inputName,
  label,
  rules,
  ...rest
}: {
  control?: Control<TFieldValues>;
  inputName: TPath;
  label: string;
  rules?: Omit<
    RegisterOptions<TFieldValues, TPath>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
} & React.InputHTMLAttributes<HTMLInputElement>) {
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
        className={clsx('input-container', { withError: error })}
        {...safeField}
        aria-label={inputName}
        aria-invalid={error ? 'true' : 'false'}
        {...rest}
      />
    </Input>
  );
}
