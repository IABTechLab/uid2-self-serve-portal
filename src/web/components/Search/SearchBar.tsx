import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import './SearchBar.scss';

type SearchBarContainerProps = React.PropsWithChildren<{ className?: string }>;
export function SearchBarContainer({ children, className }: SearchBarContainerProps) {
  return <div className={clsx('search-bar', className)}>{children}</div>;
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

type SearchBarResultsProps = React.PropsWithChildren<{ className?: string }>;
export function SearchBarResults({ children, className }: SearchBarResultsProps) {
  return <div className={clsx('search-bar-results', className)}>{children}</div>;
}
