import { IconProps } from '@radix-ui/react-icons/dist/types';
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';

import './Notification.scss';

type NotificationProps = {
  Icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  title?: string;
  notification: ReactNode;
  className?: string;
};

export function Notification({ Icon, title, notification, className }: NotificationProps) {
  return (
    <div className={className}>
      {Icon && <Icon data-testid='notification-icon' className='NotificationIcon' />}
      {title && (
        <h1 data-testid='notification-title' className='NotificationHeader'>
          {title}
        </h1>
      )}
      <div data-testid='notification'>{notification}</div>
    </div>
  );
}
