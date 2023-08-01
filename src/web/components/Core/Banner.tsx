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
  if (type === 'error') {
    icon = 'exclamation-triangle';
  } else {
    icon = 'circle-info';
  }

  return (
    <div className={clsx('banner-container', type)}>
      {type === 'warning' && <img src='/warning.svg' alt='warning' className='uid2-logo' />}
      {type !== 'warning' && (
        <FontAwesomeIcon icon={icon} data-testid='banner-icon' className='banner-icon' />
      )}
      <span data-testid='banner-message' className='banner-text'>
        {message}
      </span>
    </div>
  );
}
