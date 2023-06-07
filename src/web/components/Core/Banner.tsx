import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import './Banner.scss';

type BannerProps = {
  message: string;
  className?: string;
};

export function Banner({ message, className }: BannerProps) {
  return (
    <div className={clsx('banner-container', className)}>
      <FontAwesomeIcon icon='circle-info' data-testid='banner-icon' className='banner-icon' />
      <span data-testid='banner-message' className='banner-text'>
        {message}
      </span>
    </div>
  );
}
