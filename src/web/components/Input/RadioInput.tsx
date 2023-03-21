import * as RadioGroup from '@radix-ui/react-radio-group';
import { FieldPath, FieldValues, useController } from 'react-hook-form';

import { Input } from './Input';
import { SelectInputProps } from './SelectInput';

import './RadioInput.scss';

export function RadioInput<
  TFieldValues extends FieldValues,
  TPath extends FieldPath<TFieldValues>
>({ control, inputName, label, options, rules }: SelectInputProps<TFieldValues, TPath>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: inputName,
    rules,
  });

  return (
    <Input error={error} label={label} inputName={inputName}>
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
    </Input>
  );
}
