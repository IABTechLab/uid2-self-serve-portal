import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import './Banner.scss';
import './Messages.scss';

export type BannerProps = {
  message: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
  fitContent?: boolean;
};

export function Banner({ message, type, fitContent }: BannerProps) {
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
  const contentClass = fitContent ? 'fit-content' : '';

  return (
    <div className={clsx('banner-container message-container', type, contentClass)}>
      {getIcon()}
      <span data-testid='banner-message' className='banner-text'>
        {message}
      </span>
    </div>
  );
}
