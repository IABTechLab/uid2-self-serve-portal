import { ReactNode } from 'react';

import './ContentContainer.scss';

export type ContentContainerProps = {
  children: ReactNode;
};

export function ContentContainer({ children }: ContentContainerProps) {
  return <div className='content-container'>{children}</div>;
}
