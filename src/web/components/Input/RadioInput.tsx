/* eslint-disable react/jsx-props-no-spreading */
import * as Label from '@radix-ui/react-label';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { FieldPath, FieldValues, useController } from 'react-hook-form';

import { SelectInputProps } from './SelectInput';

import './Input.scss';
import './RadioInput.scss';

export function RadioInput<
  TFieldValues extends FieldValues,
  TPath extends FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  options,
  ...rest
}: SelectInputProps<TFieldValues, TPath> & React.InputHTMLAttributes<HTMLInputElement>) {
  const { field } = useController({
    control,
    name,
  });

  return (
    <div className='inputField' key={`${name}-input`} {...rest}>
      {label && (
        <Label.Root className='inputLabel' htmlFor={name}>
          {label}
        </Label.Root>
      )}
      <RadioGroup.Root
        className='RadioGroupRoot'
        defaultValue={field.value}
        aria-label={name}
        onValueChange={field.onChange}
      >
        {options.map(({ optionLabel, value }) => (
          <div className='radioOption' key={optionLabel}>
            <RadioGroup.Item className='RadioGroupItem' value={value} id={optionLabel}>
              <RadioGroup.Indicator className='RadioGroupIndicator' />
            </RadioGroup.Item>
            <label className='optionLabel' htmlFor={optionLabel}>
              {optionLabel}
            </label>
          </div>
        ))}
      </RadioGroup.Root>
    </div>
  );
}
