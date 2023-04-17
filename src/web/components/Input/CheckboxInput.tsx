import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Checkbox from '@radix-ui/react-checkbox';
import { FieldPath, FieldValues, useController } from 'react-hook-form';

import { BaseInputProps, Input } from './Input';
import { SelectInputProps } from './SelectInput';
import { withFormContext } from './withFormContext';

import './CheckboxInput.scss';

function CheckboxInputComponent<
  TFieldValues extends FieldValues,
  TPath extends FieldPath<TFieldValues>
>({
  control,
  inputName,
  label,
  options,
  rules,
}: SelectInputProps<TFieldValues> & BaseInputProps<TFieldValues, TPath>) {
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
export const CheckboxInput = withFormContext({ inputComponent: CheckboxInputComponent });
