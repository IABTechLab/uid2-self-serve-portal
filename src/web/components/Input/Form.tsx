import React from 'react';
import { DeepPartial, FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import './Input.scss';

type FormProps<TFieldValues extends FieldValues = FieldValues> = {
  defaultValues: DeepPartial<TFieldValues>;
  children: JSX.Element | JSX.Element[];
  onSubmit: SubmitHandler<FieldValues>;
};
export function Form({ defaultValues, children, onSubmit }: FormProps) {
  const { handleSubmit, register } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {Array.isArray(children)
        ? children.map((child) => {
            return child.props.name
              ? React.createElement(child.type, {
                  ...{
                    ...child.props,
                    register,
                    key: child.props.name as string,
                  },
                })
              : child;
          })
        : children}
    </form>
  );
}
