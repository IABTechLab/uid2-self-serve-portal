import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';

import './Notification.scss';

type NotificationProps = Readonly<{
  icon?: IconProp;
  title?: ReactNode;
  notification?: ReactNode;
  className?: string;
}>;

export function Notification({ icon, title, notification, className }: NotificationProps) {
  return (
    <div className={className}>
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          data-testid='notification-icon'
          className='notification-icon'
        />
      )}
      {title && (
        <h1 data-testid='notification-title' className='notification-header'>
          {title}
        </h1>
      )}
      <div data-testid='notification'>{notification}</div>
    </div>
  );
}
