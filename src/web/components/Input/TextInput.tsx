/* eslint-disable react/jsx-props-no-spreading */
import * as Label from '@radix-ui/react-label';
import { Control, FieldPathByValue, FieldValues, useController } from 'react-hook-form';

import './Input.scss';

export function TextInput<
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, String>
>({
  control,
  name,
  label,
  ...rest
}: {
  control?: Control<TFieldValues>;
  name: TPath;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { field } = useController({
    control,
    name,
  });

  return (
    <div className='inputField'>
      {label && (
        <Label.Root className='inputLabel' htmlFor={name}>
          {label}
        </Label.Root>
      )}
      <input className='inputContainer' {...field} {...rest} />
    </div>
  );
}
