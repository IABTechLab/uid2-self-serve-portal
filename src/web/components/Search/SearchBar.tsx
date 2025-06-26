import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { FieldPath, FieldValues, useController, useFormContext } from 'react-hook-form';

import { BaseInputProps, Input } from '../Input/Input';

import './SearchBar.scss';

type SearchBarContainerProps = React.PropsWithChildren<{
  className?: string;
  handleOnBlur?: () => void;
}>;
export function SearchBarContainer({ children, className, handleOnBlur }: SearchBarContainerProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!handleOnBlur) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        handleOnBlur();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleOnBlur]);

  return (
    <div ref={componentRef} className={clsx('search-bar', className)}>
      {children}
    </div>
  );
}

type SearchBarInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  inputClassName?: string;
  fullBorder?: boolean;
};
export function SearchBarInput({
  className,
  inputClassName,
  fullBorder,
  ...rest
}: SearchBarInputProps) {
  return (
    <div className={clsx('search-bar-input-container', className, { 'full-border': fullBorder })}>
      <FontAwesomeIcon icon='search' className='search-icon' />
      <input
        type='text'
        className={clsx('search-bar-input', inputClassName)}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />
    </div>
  );
}

export function SearchBarFormInput<
  TFieldValues extends FieldValues,
  TPath extends FieldPath<TFieldValues>
>({
  className,
  inputClassName,
  fullBorder,
  inputName,
  label,
  rules,
  ...rest
}: SearchBarInputProps &
  BaseInputProps<TFieldValues, TPath> &
  React.InputHTMLAttributes<HTMLInputElement>) {
  const { control, trigger } = useFormContext<TFieldValues>();
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: inputName,
    rules,
  });

  useEffect(() => {
    if (field.value !== undefined) {
      trigger(inputName); // Trigger validation when the field value becomes defined
    }
  }, [field.value, inputName, trigger]);

  return (
    <Input error={error} label={label} inputName={inputName}>
      <div
        className={clsx(
          'search-bar-input-container',
          className,
          {
            'full-border': fullBorder,
          },
          { withError: error }
        )}
      >
        <FontAwesomeIcon icon='search' className='search-icon' />
        <input
          type='text'
          className={clsx('search-bar-form-input', inputClassName)}
          aria-label={inputName}
          aria-invalid={error ? 'true' : 'false'}
          {...rest}
        />
      </div>
    </Input>
  );
}

type SearchBarResultsProps = React.PropsWithChildren<{ className?: string }>;
export function SearchBarResults({ children, className }: SearchBarResultsProps) {
  return <div className={clsx('search-bar-results', className)}>{children}</div>;
}
