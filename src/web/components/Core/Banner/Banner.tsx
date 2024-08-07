import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

import './Banner.scss';

export type BannerProps = Readonly<{
  message: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
  fitContent?: boolean;
}>;

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
            icon='triangle-exclamation'
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
