import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, ToastContainer, ToastContentProps } from 'react-toastify';

import './Toast.scss';

export type ToastProps = { title: ToastStatus; message: string };

type ToastStatus = 'Success' | 'Error' | 'Info' | 'Warning';

function GetIcon({ status }: { status: ToastStatus }) {
  switch (status) {
    case 'Success':
      return <FontAwesomeIcon icon='circle-check' />;
    case 'Error':
      return <FontAwesomeIcon icon='exclamation-circle' />;
    case 'Warning':
      return <FontAwesomeIcon icon='triangle-exclamation' />;
    case 'Info':
    default:
      return <FontAwesomeIcon icon='circle-info' />;
  }
}

function ToastComponent({ title, message, closeToast }: ToastProps & ToastContentProps) {
  return (
    <div className='toast-content'>
      <div className='toast-title-container'>
        <div>
          <GetIcon status={title} />
          <span className='toast-title'>{title}</span>
        </div>
        <button
          className='toast-close-button icon-button'
          aria-label='Close'
          type='button'
          onClick={closeToast}
        >
          <FontAwesomeIcon icon='xmark' />
        </button>
      </div>
      <div className='toast-message'>{message}</div>
    </div>
  );
}

export function SuccessToast(message: string) {
  toast.success((props: ToastContentProps) => (
    <ToastComponent title='Success' message={message} {...props} />
  ));
}

export function InfoToast(message: string) {
  toast.info((props: ToastContentProps) => (
    <ToastComponent title='Info' message={message} {...props} />
  ));
}

export function WarningToast(message: string) {
  toast.warning((props: ToastContentProps) => (
    <ToastComponent title='Warning' message={message} {...props} />
  ));
}

export function ErrorToast(message: string) {
  toast.error((props: ToastContentProps) => (
    <ToastComponent title='Error' message={message} {...props} />
  ));
}

export function ToastContainerWrapper() {
  return <ToastContainer hideProgressBar icon={false} closeButton={false} />;
}
