import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import './StatusPopup.scss';

interface StatusPopupProps {
  message: string;
  status: 'Success' | 'Error' | 'Info';
  displayDuration?: number;
}

export function StatusPopup({ message, status, displayDuration = 3000 }: StatusPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => setShow(false), displayDuration);
    return () => clearTimeout(timer);
  }, [displayDuration, message, status]);

  const getIcon = () => {
    switch (status) {
      case 'Success':
        return <FontAwesomeIcon icon='circle-check' />;
      case 'Error':
        return <FontAwesomeIcon icon='exclamation-circle' />;
      case 'Info':
      default:
        return <FontAwesomeIcon icon='circle-info' />;
    }
  };

  return show ? (
    <div className={`status-popup ${status}`}>
      <button
        className='popup-close-button icon-button'
        aria-label='Close'
        type='button'
        onClick={() => setShow(false)}
      >
        <FontAwesomeIcon className='popup-close-icon' icon='xmark' />
      </button>
      <div className={`status-popup-title-container ${status}`}>
        {getIcon()}
        <span className='status-popup-title'>{status}</span>
      </div>
      <div className='status-popup-message'>{message}</div>
    </div>
  ) : null;
}

export default StatusPopup;
