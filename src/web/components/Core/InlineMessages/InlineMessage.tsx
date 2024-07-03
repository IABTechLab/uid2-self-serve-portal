import clsx from 'clsx';
import { ReactNode } from 'react';

import './InlineMessage.scss';
import '../Banner/Banner.scss';

export type InlineMessageProps = Readonly<{
  message: ReactNode;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
}>;

export function InlineMessage({ message, type }: InlineMessageProps) {
  return (
    <div className={clsx('inline-message message-container', type)}>
      <span data-testid='banner-message' className='banner-text'>
        {message}
      </span>
    </div>
  );
}
