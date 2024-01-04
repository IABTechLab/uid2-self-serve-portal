import { useState } from 'react';

import Popover from './Popover';
import { StatusPopup } from './StatusPopup';

import './KeySecretReveal.scss';

function ViewKeyButton({ value, title }: { value: string; title: string }) {
  return (
    <Popover
      triggerButton={
        <button className='icon-button show-button' aria-label={title} type='button' title={title}>
          View
        </button>
      }
    >
      <p>{value}</p>
    </Popover>
  );
}

function KeySecretReveal({ value, title }: { value: string; title: string }) {
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);

  const display: string =
    value.length > 20
      ? `${value.substring(0, 10)}......${value.substring(value.length - 10, value.length)}`
      : value;

  const copyKey = (): void => {
    setShowStatusPopup(true);
    navigator.clipboard.writeText(value);
  };

  return (
    <div className='key-secret-reveal'>
      <h2>{title}</h2>
      {display}
      <ViewKeyButton value={value} title={title} />|
      <button
        className='icon-button copy-button'
        aria-label='copy'
        type='button'
        onClick={() => copyKey()}
        title={`Copy ${title} to clipboard`}
      >
        Copy
      </button>
      {showStatusPopup && (
        <StatusPopup
          status='Success'
          show={showStatusPopup}
          setShow={setShowStatusPopup}
          message={`${title} copied to clipboard.`}
        />
      )}
    </div>
  );
}

export default KeySecretReveal;
