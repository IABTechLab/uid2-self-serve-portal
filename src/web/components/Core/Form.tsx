/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode, useCallback } from 'react';
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormRegisterReturn,
} from 'react-hook-form';

import { extractMessageFromAxiosError } from '../../utils/errorHelpers';

import './Form.scss';

type FormProps<T extends FieldValues> = Readonly<{
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  onError?: (error: unknown) => void;
  defaultValues?: DefaultValues<T>;
  disableSubmitWhenInvalid?: boolean;
  submitButtonText?: string;
  customizeSubmit?: boolean;
  id?: string;
}>;

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
        const message =
          extractMessageFromAxiosError(err as Error) ?? 'Something went wrong, please try again';

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
