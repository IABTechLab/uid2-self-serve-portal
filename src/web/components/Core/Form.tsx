import axios from 'axios';
import React, { createContext, ReactNode, useCallback, useMemo } from 'react';
import { Control, DeepPartial, FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import './Form.scss';

type FormProps<T extends FieldValues> = {
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  onError?: (error: unknown) => void;
  defaultValues?: DeepPartial<T>;
  submitButtonText?: string;
  customizeSubmit?: boolean;
};

export type FormContextType<T extends FieldValues> = {
  control: Control<T>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormContext = createContext<FormContextType<any> | null>(null);

export function Form<T extends FieldValues>({
  onSubmit,
  onError,
  defaultValues,
  children,
  submitButtonText,
  customizeSubmit,
}: FormProps<T>) {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  });

  const submit = useCallback(
    async (formData: T) => {
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
      }
    },
    [onError, onSubmit, setError]
  );

  const formContextValue = useMemo(() => {
    return { control, handleSubmit: handleSubmit(submit) };
  }, [control, handleSubmit, submit]);

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FormContext.Provider value={formContextValue as FormContextType<T>}>
        {errors.root?.serverError && (
          <p className='form-error' data-testid='formError'>
            {errors.root?.serverError.message}
          </p>
        )}
        {children}
        {!customizeSubmit && (
          <div className='form-footer'>
            <button type='submit' disabled={isSubmitting} className='primary-button'>
              {submitButtonText ?? 'Submit'}
            </button>
          </div>
        )}
      </FormContext.Provider>
    </form>
  );
}
