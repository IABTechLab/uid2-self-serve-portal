import { ReactNode } from 'react';

import './ScreenContentContainer.scss';

export type ContentContainerProps = {
  children: ReactNode;
};

export function ScreenContentContainer({ children }: ContentContainerProps) {
  return <div className='screen-content-container'>{children}</div>;
}
