import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Checkbox from '@radix-ui/react-checkbox';
import { FieldPath, FieldValues, useController, useFormContext } from 'react-hook-form';

import { BaseInputProps, Input } from './Input';
import { SelectInputProps } from './SelectInput';

import './CheckboxInput.scss';

export function CheckboxInput<
  TFieldValues extends FieldValues,
  TPath extends FieldPath<TFieldValues>
>({
  inputName,
  label,
  options,
  rules,
}: SelectInputProps<TFieldValues> & BaseInputProps<TFieldValues, TPath>) {
  const { control } = useFormContext<TFieldValues>();
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
      <div className='inline-options'>
        {options.map(({ optionLabel, value }) => (
          <div className='checkbox-option' key={optionLabel}>
            <Checkbox.Root
              className='checkbox-root'
              id={optionLabel}
              value={value}
              aria-invalid={error ? 'true' : 'false'}
              defaultChecked={(field.value as Array<TPath>).includes(value)}
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
              <Checkbox.Indicator className='checkbox-indicator'>
                <FontAwesomeIcon icon='check' />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <label className='option-label' htmlFor={optionLabel}>
              {optionLabel}
            </label>
          </div>
        ))}
      </div>
    </Input>
  );
}
