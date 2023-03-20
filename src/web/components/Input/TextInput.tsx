/* eslint-disable react/jsx-props-no-spreading */
import * as Label from '@radix-ui/react-label';
import clsx from 'clsx';
import {
  Control,
  FieldPathByValue,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form';

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
    <div className='inputField' key={`${inputName}-input`}>
      {label && (
        <Label.Root className='inputLabel' htmlFor={inputName}>
          {label}
        </Label.Root>
      )}
      <input
        className={clsx('inputContainer', { withError: error })}
        {...safeField}
        aria-label={inputName}
        aria-invalid={error ? 'true' : 'false'}
        {...rest}
      />
      {error && <span role='alert'>{error.message}</span>}
    </div>
  );
}
