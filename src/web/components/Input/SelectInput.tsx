import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Select from '@radix-ui/react-select';
import clsx from 'clsx';
import { FieldPath, FieldValue, FieldValues, useController } from 'react-hook-form';

import { BaseInputProps, Input } from './Input';
import { withFormContext } from './withFormContext';

import './SelectInput.scss';

export type Option<T> = {
  optionLabel: string;
  value: T;
};
export type SelectInputProps<TFieldValues extends FieldValues> = {
  options: Option<FieldValue<TFieldValues>>[];
};

function SelectInputComponent<
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
      <Select.Root onValueChange={field.onChange}>
        <Select.Trigger
          className={clsx('input-container', 'select-trigger', { withError: error })}
          aria-label={inputName}
          aria-invalid={error ? 'true' : 'false'}
        >
          <Select.Value />
          <Select.Icon className='select-icon'>
            <FontAwesomeIcon icon='chevron-down' />
          </Select.Icon>
        </Select.Trigger>

        <Select.Content className='select-content'>
          <Select.ScrollUpButton className='select-scroll-button'>
            <FontAwesomeIcon icon='chevron-up' />
          </Select.ScrollUpButton>
          <Select.Viewport className='select-viewport'>
            {options.map(({ optionLabel, value }) => (
              <Select.Item value={value} className='select-item' key={optionLabel}>
                <Select.ItemText>{optionLabel}</Select.ItemText>
                <Select.ItemIndicator className='select-item-indicator'>
                  <FontAwesomeIcon icon='check' />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton />
          <Select.Arrow />
        </Select.Content>
      </Select.Root>
    </Input>
  );
}

export const SelectInput = withFormContext({ inputComponent: SelectInputComponent });
