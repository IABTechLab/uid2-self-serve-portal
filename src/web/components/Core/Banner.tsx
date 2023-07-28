import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import './Banner.scss';

type BannerProps = {
  message: string;
  type: 'info' | 'warning' | 'error';
};

export function Banner({ message, type }: BannerProps) {
  let icon: IconProp;

  if (type === 'warning') {
    icon = 'triangle-exclamation';
  } else if (type === 'error') {
    icon = 'fishing-rod';
  } else {
    icon = 'circle-info';
  }

  return (
    <div className={clsx('banner-container', type)}>
      <FontAwesomeIcon icon={icon} data-testid='banner-icon' className='banner-icon' />
      <span data-testid='banner-message' className='banner-text'>
        {message}
      </span>
    </div>
  );
}
