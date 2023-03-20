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
  inputName,
  label,
  options,
  rules,
  ...rest
}: SelectInputProps<TFieldValues, TPath> & React.InputHTMLAttributes<HTMLInputElement>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: inputName,
    rules,
  });

  return (
    <div className='inputField' key={`${inputName}-input`} {...rest}>
      {label && (
        <Label.Root className='inputLabel' htmlFor={inputName}>
          {label}
        </Label.Root>
      )}
      <RadioGroup.Root
        className='RadioGroupRoot'
        defaultValue={field.value}
        aria-label={inputName}
        aria-invalid={error ? 'true' : 'false'}
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
      {error && <span role='alert'>{error.message}</span>}
    </div>
  );
}
