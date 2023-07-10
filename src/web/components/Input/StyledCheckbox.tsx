import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Checkbox from '@radix-ui/react-checkbox';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

import './CheckboxInput.scss';

export function StyledCheckbox(props: Checkbox.CheckboxProps) {
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
    >
      {childrenOrDefault}
    </Checkbox.Root>
  );
}

export function FormStyledCheckbox<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(props: UseControllerProps<TFieldValues, TFieldName>) {
  const { field } = useController<TFieldValues, TFieldName>({ ...props });
  return (
    <StyledCheckbox
      checked={field.value}
      onBlur={field.onBlur}
      name={field.name}
      onCheckedChange={field.onChange}
    />
  );
}
