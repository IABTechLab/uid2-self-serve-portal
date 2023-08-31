import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';

import './StatusPopup.scss';
import './Messages.scss';

export interface StatusPopupProps {
  message: string;
  status: 'Success' | 'Error' | 'Info' | 'Warning';
  displayDuration?: number;
  show: boolean;
  setShow: (show: boolean) => void;
}

export type StatusNotificationType = {
  message: string;
  type: 'Success' | 'Error' | 'Info' | 'Warning';
};

export function StatusPopup({
  message,
  status,
  displayDuration = 3000,
  show,
  setShow,
}: StatusPopupProps) {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (show) {
      timer = setTimeout(() => setShow(false), displayDuration);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [displayDuration, setShow, show, status, message]);

  const getIcon = () => {
    switch (status) {
      case 'Success':
        return <FontAwesomeIcon icon='circle-check' />;
      case 'Error':
        return <FontAwesomeIcon icon='exclamation-circle' />;
      case 'Warning':
        return <FontAwesomeIcon icon='exclamation-triangle' />;
      case 'Info':
      default:
        return <FontAwesomeIcon icon='circle-info' />;
    }
  };

  return show ? (
    <div className={`status-popup message-container ${status}`}>
      <div className={`status-popup-title-container ${status}`}>
        <div>
          {getIcon()}
          <span className='status-popup-title'>{status}</span>
        </div>
        <div className='status-popup-title-right'>
          <button
            className='popup-close-button icon-button'
            aria-label='Close'
            type='button'
            onClick={() => setShow(false)}
          >
            <FontAwesomeIcon className='popup-close-icon' icon='xmark' />
          </button>
        </div>
      </div>
      <div className='status-popup-message'>{message}</div>
    </div>
  ) : null;
}

export default StatusPopup;
