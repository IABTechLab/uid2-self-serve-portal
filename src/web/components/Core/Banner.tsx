import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import './Banner.scss';

export type BannerProps = {
  message: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
};

export function Banner({ message, type }: BannerProps) {
  const getIcon = () => {
    switch (type) {
      case 'Success':
        return (
          <FontAwesomeIcon icon='circle-check' data-testid='banner-icon' className='banner-icon' />
        );
      case 'Error':
        return (
          <FontAwesomeIcon
            icon='exclamation-circle'
            data-testid='banner-icon'
            className='banner-icon'
          />
        );
      case 'Warning':
        return (
          <FontAwesomeIcon
            icon='exclamation-triangle'
            data-testid='banner-icon'
            className='banner-icon'
          />
        );
      case 'Info':
      default:
        return (
          <FontAwesomeIcon icon='circle-info' data-testid='banner-icon' className='banner-icon' />
        );
    }
  };

  return (
    <div className={clsx('banner-container', type)}>
      {getIcon()}
      <span data-testid='banner-message' className='banner-text'>
        {message}
      </span>
    </div>
  );
}
