import clsx from 'clsx';

import './InlineMessage.scss';
import './Messages.scss';

export type InlineMessageProps = {
  message: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
};

export function InlineMessage({ message, type }: InlineMessageProps) {
  return (
    <div className={clsx('inline-message message-container', type)}>
      <span data-testid='banner-message' className='banner-text'>
        {message}
      </span>
    </div>
  );
}
