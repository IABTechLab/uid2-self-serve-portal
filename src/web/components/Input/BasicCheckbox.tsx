import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Checkbox from '@radix-ui/react-checkbox';
import React from 'react';
import {
  Controller,
  FieldPath,
  FieldValues,
  useController,
  UseControllerProps,
  UseFormRegisterReturn,
} from 'react-hook-form';

import './CheckboxInput.scss';

export function StyledCheckbox(props: Checkbox.CheckboxProps) {
  const className = `${props?.className ?? ''} checkbox-root`.trim();
  const childrenOrDefault = props.children ?? (
    <Checkbox.CheckboxIndicator className='checkbox-indicator'>
      <FontAwesomeIcon icon='check' />
    </Checkbox.CheckboxIndicator>
  );
  const rootProps = { ...props, className };
  console.log('Styled props', rootProps);
  return (
    <Checkbox.Root
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rootProps}
    >
      {childrenOrDefault}
    </Checkbox.Root>
  );
}

export function FormStyledCheckbox<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(
  props: Checkbox.CheckboxProps &
    UseControllerProps<TFieldValues, TFieldName> &
    Omit<UseFormRegisterReturn<TFieldName>, 'ref'>
) {
  const {
    field,
    fieldState: { error },
  } = useController<TFieldValues, TFieldName>({ ...props });
  console.log('Form styled props', props);
  const handleChange = (checked: Checkbox.CheckedState) => {
    field.onChange(checked);
    if (props.onCheckedChange) props.onCheckedChange(checked);
  };

  return (
    <StyledCheckbox
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      checked={field.value}
      onCheckedChange={handleChange}
    />
  );
}

// type TestForm = {
//   test: boolean;
//   value: number;
// };

// const BoolCheckbox = FormStyledCheckbox<TextForm, 'test'>({
//   name: 'test'
// });
