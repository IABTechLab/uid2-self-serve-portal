import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Checkbox from '@radix-ui/react-checkbox';
import React from 'react';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

import './MultiCheckboxInput.scss';

export const StyledCheckbox = React.forwardRef<HTMLButtonElement, Checkbox.CheckboxProps>((props, ref) => {
  const className = `${props?.className ?? ''} checkbox-root`.trim();
  const childrenOrDefault = props.children ?? (
    <Checkbox.CheckboxIndicator className='checkbox-indicator'>
      <FontAwesomeIcon icon='check' />
    </Checkbox.CheckboxIndicator>
  );
  const rootProps = { ...props, className };
  return (
    <Checkbox.Root
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rootProps}
			ref={ref}
    >
      {childrenOrDefault}
    </Checkbox.Root>
  );
});
type ExtraCheckboxProps = Omit<
  Checkbox.CheckboxProps,
  'checked' | 'defaultChecked' | 'required' | 'onCheckedChange'
>;

function FormStyledCheckboxInner<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: UseControllerProps<TFieldValues, TFieldName> & ExtraCheckboxProps,
  ref: React.Ref<HTMLButtonElement>
) {
  const { field } = useController<TFieldValues, TFieldName>(props);
  return (
    <StyledCheckbox
      {...props}
      ref={ref}
      checked={field.value}
      onBlur={field.onBlur}
      name={field.name}
      onCheckedChange={field.onChange}
    />
  );
}

export const FormStyledCheckbox = React.forwardRef(FormStyledCheckboxInner) as <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: UseControllerProps<TFieldValues, TFieldName> & ExtraCheckboxProps & {
    ref?: React.Ref<HTMLButtonElement>;
  }
) => React.ReactElement | null;
