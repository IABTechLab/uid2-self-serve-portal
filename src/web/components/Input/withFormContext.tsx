import { useContext } from 'react';
import { FieldPathByValue, FieldValues } from 'react-hook-form';

import { FormContext } from '../Core/Form';
import { BaseInputProps } from './Input';

type WithFormContextProps<
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, String>,
  T extends BaseInputProps<TFieldValues, TPath>
> = {
  inputComponent: React.FC<T>;
};

export function withFormContext<
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, String>,
  T extends BaseInputProps<TFieldValues, TPath>
>({ inputComponent: InputComponent }: WithFormContextProps<TFieldValues, TPath, T>) {
  return function WithFormContextImpl(props: T) {
    const context = useContext(FormContext);

    if (!context) {
      throw new Error('withFormContext components must be used within a Form component');
    }

    const { control } = context;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <InputComponent {...props} control={control} />;
  };
}
