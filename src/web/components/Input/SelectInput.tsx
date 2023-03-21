import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';
import clsx from 'clsx';
import {
  Control,
  FieldPath,
  FieldValue,
  FieldValues,
  RegisterOptions,
  useController,
} from 'react-hook-form';

import { Input } from './Input';

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
  inputName: TPath;
  label?: string;
  rules?: Omit<
    RegisterOptions<TFieldValues, TPath>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
};
export function SelectInput<
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
      <Select.Root onValueChange={field.onChange}>
        <Select.Trigger
          className={clsx('inputContainer', 'SelectTrigger', { withError: error })}
          aria-label={inputName}
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
    </Input>
  );
}
