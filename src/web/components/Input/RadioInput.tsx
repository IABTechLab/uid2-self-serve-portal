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
        className='radio-group-root'
        defaultValue={field.value}
        aria-label={inputName}
        aria-invalid={error ? 'true' : 'false'}
        onValueChange={field.onChange}
      >
        {options.map(({ optionLabel, value }) => (
          <div className='radio-option' key={optionLabel}>
            <RadioGroup.Item className='radio-group-item' value={value} id={optionLabel}>
              <RadioGroup.Indicator className='radio-group-indicator' />
            </RadioGroup.Item>
            <label className='option-label' htmlFor={optionLabel}>
              {optionLabel}
            </label>
          </div>
        ))}
      </RadioGroup.Root>
    </Input>
  );
}
