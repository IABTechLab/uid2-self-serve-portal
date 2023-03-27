import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';

import './Notification.scss';

type NotificationProps = {
  icon?: IconProp;
  title?: string;
  notification: ReactNode;
  className?: string;
};

export function Notification({ icon, title, notification, className }: NotificationProps) {
  return (
    <div className={className}>
      {icon && (
        <FontAwesomeIcon icon={icon} data-testid='notification-icon' className='NotificationIcon' />
      )}
      {title && (
        <h1 data-testid='notification-title' className='NotificationHeader'>
          {title}
        </h1>
      )}
      <div data-testid='notification'>{notification}</div>
    </div>
  );
}
