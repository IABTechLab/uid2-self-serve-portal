/* eslint-disable react/jsx-props-no-spreading */
import axios from 'axios';
import { ReactNode, useCallback } from 'react';
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormRegisterReturn,
} from 'react-hook-form';

import './Form.scss';

type FormProps<T extends FieldValues> = {
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  onError?: (error: unknown) => void;
  defaultValues?: DefaultValues<T>;
  disableSubmitWhenInvalid?: boolean;
  submitButtonText?: string;
  customizeSubmit?: boolean;
  id?: string;
};

export function withoutRef<TFieldName extends string>(props: UseFormRegisterReturn<TFieldName>) {
  const { ref, ...rest } = props;
  return rest;
}

export function Form<T extends FieldValues>({
  id,
  onSubmit,
  onError,
  defaultValues,
  children,
  disableSubmitWhenInvalid,
  submitButtonText,
  customizeSubmit,
}: FormProps<T>) {
  const methods = useForm<T>({
    defaultValues,
  });
  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = methods;
  const submit = useCallback(
    async (formData: T) => {
      try {
        await onSubmit(formData);
      } catch (err) {
        if (onError) onError(err);
        let message = 'Something went wrong, please try again';
        if (axios.isAxiosError(err)) {
          if (err.response?.data?.message) {
            message = err.response?.data?.message as string;
          } else if ((err.response?.data ?? [])[0]?.message) {
            message = err.response?.data[0]?.message as string;
          } else if (err.response?.data) {
            message = err.response?.data as string;
          }
        }

        setError('root.serverError', {
          type: '400',
          message,
        });
      }
    },
    [onError, onSubmit, setError]
  );

  return (
    <form onSubmit={handleSubmit(submit)} id={id}>
      <FormProvider {...methods}>
        {errors.root?.serverError && (
          <p className='form-error' data-testid='formError'>
            {errors.root?.serverError.message}
          </p>
        )}
        {children}
        {!customizeSubmit && (
          <div className='form-footer'>
            <button
              type='submit'
              disabled={isSubmitting || (disableSubmitWhenInvalid && (!isDirty || !isValid))}
              className='primary-button'
            >
              {submitButtonText ?? 'Submit'}
            </button>
          </div>
        )}
      </FormProvider>
    </form>
  );
}
