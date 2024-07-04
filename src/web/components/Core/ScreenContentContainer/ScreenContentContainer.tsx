import { ReactNode } from 'react';

import './ScreenContentContainer.scss';

export type ContentContainerProps = Readonly<{
  children: ReactNode;
}>;

export function ScreenContentContainer({ children }: ContentContainerProps) {
  return <div className='screen-content-container'>{children}</div>;
}
