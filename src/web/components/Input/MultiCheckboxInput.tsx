import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useCallback, useEffect } from 'react';
import { FieldPath, FieldValues, useController, useFormContext } from 'react-hook-form';

import { Tooltip } from '../Core/Tooltip';
import { BaseInputProps, Input } from './Input';
import { SelectInputProps } from './SelectInput';

import './MultiCheckboxInput.scss';

export function MultiCheckboxInput<
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

  useEffect(() => {
    if (field.value === undefined) {
      field.onChange([]);
    }
  }, [field]);

  const isDefaultChecked = useCallback(
    (value: TPath) => {
      return ((field.value as Array<TPath>) ?? []).includes(value);
    },
    [field.value]
  );

  const onCheckedChange = (checked: boolean, value: TPath) => {
    const valueCopy = new Set(field.value);
    if (checked) {
      valueCopy.add(value);
    } else {
      valueCopy.delete(value);
    }

    field.onChange(Array.from(valueCopy));
  };

  const isChecked = (value: TPath) => {
    return ((field.value as Array<TPath>) ?? []).includes(value);
  };

  return (
    <Input error={error} label={label} inputName={inputName}>
      <div className='inline-options'>
        {options.map(({ optionLabel, optionToolTip, value }) => (
          <div className='checkbox-option' key={optionLabel}>
            <Checkbox.Root
              className='checkbox-root'
              id={optionLabel}
              value={value}
              aria-invalid={error ? 'true' : 'false'}
              defaultChecked={isDefaultChecked(value)}
              onCheckedChange={(checked: boolean) => onCheckedChange(checked, value)}
              checked={isChecked(value)}
            >
              <Checkbox.Indicator className='checkbox-indicator'>
                <FontAwesomeIcon icon='check' />
              </Checkbox.Indicator>
            </Checkbox.Root>

            <label className='option-label' htmlFor={optionLabel}>
              {!optionToolTip ? (
                optionLabel
              ) : (
                <Tooltip trigger={optionLabel}>{optionToolTip}</Tooltip>
              )}
            </label>
          </div>
        ))}
      </div>
    </Input>
  );
}
