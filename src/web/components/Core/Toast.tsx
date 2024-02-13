import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, ToastContainer, ToastContentProps } from 'react-toastify';

import './Toast.scss';

export type ToasterProps = { title: ToastStatus; message: string };

type ToastStatus = 'Success' | 'Error' | 'Info' | 'Warning';

function GetIcon({ status }: { status: ToastStatus }) {
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
}

function ToasterComponent({ title, message, closeToast }: ToasterProps & ToastContentProps) {
  return (
    <div className='toaster-content'>
      <div className='toaster-title-container'>
        <div>
          <GetIcon status={title} />
          <span className='toaster-title'>{title}</span>
        </div>
        <button
          className='toaster-close-button icon-button'
          aria-label='Close'
          type='button'
          onClick={closeToast}
        >
          <FontAwesomeIcon icon='xmark' />
        </button>
      </div>
      <div className='toaster-message'>{message}</div>
    </div>
  );
}

export function SuccessToast(message: string) {
  toast.success((props: ToastContentProps) => (
    <ToasterComponent title='Success' message={message} {...props} />
  ));
}

export function InfoToast(message: string) {
  toast.info((props: ToastContentProps) => (
    <ToasterComponent title='Info' message={message} {...props} />
  ));
}

export function WarningToast(message: string) {
  toast.warning((props: ToastContentProps) => (
    <ToasterComponent title='Warning' message={message} {...props} />
  ));
}

export function ErrorToast(message: string) {
  toast.error((props: ToastContentProps) => (
    <ToasterComponent title='Error' message={message} {...props} />
  ));
}

export function ToastContainerWrapper() {
  return <ToastContainer hideProgressBar icon={false} closeButton={false} />;
}
