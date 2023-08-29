import clsx from 'clsx';

import './InlineMessage.scss';

export type InlineMessageProps = {
  message: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
};

export function InlineMessage({ message, type }: InlineMessageProps) {
  return (
    <div className={clsx('inline-message', type)}>
      <span data-testid='banner-message' className='banner-text'>
        {message}
      </span>
    </div>
  );
}
