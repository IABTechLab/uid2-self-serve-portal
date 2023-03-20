/* eslint-disable react/jsx-props-no-spreading */
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import classNames from 'classnames';
import {
  Control,
  FieldPath,
  FieldValue,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form';

import './Input.scss';
import './SelectInput.scss';

export type Option<T> = {
  optionLabel: string;
  value: T;
};
export type SelectInputProps<
  TFieldValues extends FieldValues,
  TPath extends FieldPath<TFieldValues>
> = {
  options: Option<FieldValue<TFieldValues>>[];
  control?: Control<TFieldValues>;
  name: TPath;
  label?: string;
  rules?: Omit<
    RegisterOptions<TFieldValues, TPath>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
};
export function SelectInput<
  TFieldValues extends FieldValues,
  TPath extends FieldPath<TFieldValues>
>({ control, name, label, options, rules }: SelectInputProps<TFieldValues, TPath>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    rules,
  });

  return (
    <div className='inputField' key={`${name}-input`}>
      {label && (
        <Label.Root className='inputLabel' htmlFor={name}>
          {label}
        </Label.Root>
      )}
      <Select.Root onValueChange={field.onChange}>
        <Select.Trigger
          className={classNames('inputContainer', 'SelectTrigger', { withError: error })}
          aria-label={name}
          aria-invalid={error ? 'true' : 'false'}
        >
          <Select.Value />
          <Select.Icon className='SelectIcon'>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className='SelectContent'>
            <Select.ScrollUpButton className='SelectScrollButton'>
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className='SelectViewport'>
              {options.map(({ optionLabel, value }) => (
                <Select.Item value={value} className='SelectItem' key={optionLabel}>
                  <Select.ItemText>{optionLabel}</Select.ItemText>
                  <Select.ItemIndicator className='SelectItemIndicator'>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton />
            <Select.Arrow />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      {error && <span role='alert'>{error.message}</span>}
    </div>
  );
}
