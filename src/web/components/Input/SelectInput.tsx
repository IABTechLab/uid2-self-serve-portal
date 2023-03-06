/* eslint-disable react/jsx-props-no-spreading */
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import React from 'react';
import { Control, FieldPath, FieldValue, FieldValues, useController } from 'react-hook-form';

import './Input.scss';
import './Select.scss';

export type Option<T> = {
  optionLabel: string;
  value: T;
};
export type SelectInputProps<
  TFieldValues extends FieldValues,
  TPath extends FieldPath<TFieldValues>
> = {
  options: Option<FieldValue<TFieldValues>>[];
  control: Control<TFieldValues>;
  name: TPath;
  label?: string;
};
export function SelectInput<
  TFieldValues extends FieldValues,
  TPath extends FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  options,
  ...rest
}: SelectInputProps<TFieldValues, TPath> & React.SelectHTMLAttributes<HTMLSelectElement>) {
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
      <select className='textInput' {...field} {...rest}>
        {options.map(({ optionLabel, value }) => (
          <option value={value} key={value}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
