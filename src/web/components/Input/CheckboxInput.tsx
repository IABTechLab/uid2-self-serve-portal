import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { FieldPath, FieldValues, useController } from 'react-hook-form';

import { Input } from './Input';
import { SelectInputProps } from './SelectInput';

import './CheckboxInput.scss';

export function CheckboxInput<
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
      <div className='inlineOptions'>
        {options.map(({ optionLabel, value }) => (
          <div className='checkboxOption' key={optionLabel}>
            <Checkbox.Root
              className='CheckboxRoot'
              id={optionLabel}
              value={value}
              aria-invalid={error ? 'true' : 'false'}
              onCheckedChange={(checked: boolean) => {
                const valueCopy = new Set(field.value);
                if (checked) {
                  valueCopy.add(value);
                } else {
                  valueCopy.delete(value);
                }
                field.onChange(Array.from(valueCopy));
              }}
            >
              <Checkbox.Indicator className='CheckboxIndicator'>
                <CheckIcon />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <label className='optionLabel' htmlFor={optionLabel}>
              {optionLabel}
            </label>
          </div>
        ))}
      </div>
    </Input>
  );
}
