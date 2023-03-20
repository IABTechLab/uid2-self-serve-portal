/* eslint-disable react/jsx-props-no-spreading */
import * as Label from '@radix-ui/react-label';
import classNames from 'classnames';
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
  name,
  label,
  rules,
  ...rest
}: {
  control?: Control<TFieldValues>;
  name: TPath;
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
    name,
    rules,
  });
  const safeField = { ...field, value: field.value ?? '' }; // Ensure the value is never undefined

  return (
    <div className='inputField' key={`${name}-input`}>
      {label && (
        <Label.Root className='inputLabel' htmlFor={name} aria-label={name}>
          {label}
        </Label.Root>
      )}
      <input
        className={classNames('inputContainer', { withError: error })}
        {...safeField}
        {...rest}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && <span role='alert'>{error.message}</span>}
    </div>
  );
}
