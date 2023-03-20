import axios from 'axios';
import React, { cloneElement, isValidElement, ReactElement, ReactNode } from 'react';
import { DeepPartial, FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import './Form.scss';

type FormProps<T extends FieldValues> = {
  onSubmit: SubmitHandler<T>;
  children: ReactNode[];
  onSubmitCallback?: () => Promise<void>;
  onError?: (error: unknown) => void;
  defaultValues?: DeepPartial<T>;
  submitButtonText?: string;
};

export function Form<T extends FieldValues>({
  onSubmit,
  onSubmitCallback,
  onError,
  defaultValues,
  children,
  submitButtonText,
}: FormProps<T>) {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  });

  const submit = async (formData: T) => {
    try {
      await onSubmit(formData);
    } catch (err) {
      if (onError) onError(err);
      const message =
        axios.isAxiosError(err) && (err.response?.data ?? [])[0]?.message
          ? ((err.response?.data ?? [])[0]?.message as string)
          : 'Something went wrong, please try again';

      setError('root.serverError', {
        type: '400',
        message,
      });
      return;
    }
    if (onSubmitCallback) await onSubmitCallback();
  };

  const isInputComponent = (child: ReactNode): child is ReactElement => {
    return isValidElement(child) && typeof child.type === 'function' && 'inputName' in child.props;
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      {errors.root?.serverError && (
        <p className='formError' data-testid='form-error'>
          {errors.root?.serverError.message}
        </p>
      )}
      {React.Children.map(children, (child) =>
        isInputComponent(child) ? cloneElement(child, { control }) : child
      )}
      <div className='formFooter'>
        <button type='submit' disabled={isSubmitting} className='primaryButton largeButton'>
          {submitButtonText ?? 'Submit'}
        </button>
      </div>
    </form>
  );
}
