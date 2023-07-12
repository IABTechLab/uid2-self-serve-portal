import { PropsWithChildren } from 'react';
import { FieldErrors, FieldValues, UseFormSetError } from 'react-hook-form';

export function setGlobalErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  errors: string[]
) {
  errors.forEach((m, i) => {
    setError(`root.serverError-${i}`, {
      message: m,
    });
  });
}

export function getGlobalErrorsAsArray(root: FieldErrors['root']) {
  if (!root) return [];
  if ('message' in root && typeof root.message === 'string') {
    return [{ name: 'error', message: root.message }];
  }
  return Object.keys(root).map((k) => ({
    name: k,
    message: root[k].message || 'Unknown error',
  }));
}

export function FormError({ display, children }: PropsWithChildren<{ display: boolean }>) {
  return display ? <div className='form-error'>{children}</div> : null;
}

type RootFormErrorsProps = {
  fieldErrors: FieldErrors;
};
export function RootFormErrors({ fieldErrors, children }: PropsWithChildren<RootFormErrorsProps>) {
  return (
    <FormError display={!!fieldErrors.root}>
      {children}
      {getGlobalErrorsAsArray(fieldErrors.root).map((err) => (
        <div key={err.name}>{err.message}</div>
      ))}
    </FormError>
  );
}
