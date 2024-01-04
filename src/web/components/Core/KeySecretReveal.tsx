import { useState } from 'react';

import Popover from './Popover';
import { StatusPopup } from './StatusPopup';

import './KeySecretReveal.scss';

function ViewKeyButton({
  value,
  title,
  confirmCopiedSecret,
}: {
  value: string;
  title: string;
  confirmCopiedSecret: () => void;
}) {
  const display =
    value.length > 20
      ? `${value.substring(0, 10)}......${value.substring(value.length - 10, value.length)}`
      : value;

  return (
    <>
      {display}
      {value.length > 20 && (
        <>
          <Popover
            triggerButton={
              <button
                className='icon-button show-button'
                aria-label={title}
                type='button'
                title={title}
                onClick={confirmCopiedSecret}
              >
                View
              </button>
            }
          >
            <p>{value}</p>
          </Popover>
          |
        </>
      )}
    </>
  );
}

function KeySecretReveal({
  value,
  title,
  setCopiedSecrets,
}: {
  value: string;
  title: string;
  setCopiedSecrets?: React.Dispatch<React.SetStateAction<Map<String, boolean>>>;
}) {
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);

  if (setCopiedSecrets) {
    setCopiedSecrets((prevMap) => {
      if (!prevMap.has(value)) prevMap.set(value, false);
      return prevMap;
    });
  }

  const confirmCopiedSecret = () => {
    if (setCopiedSecrets) {
      setCopiedSecrets((prevMap) => {
        prevMap.set(value, true);
        return prevMap;
      });
    }
  };

  const copyKey = (): void => {
    setShowStatusPopup(true);
    navigator.clipboard.writeText(value);
    confirmCopiedSecret();
  };

  return (
    <div className='key-secret-reveal'>
      <h2>{title}</h2>
      <ViewKeyButton value={value} title={title} confirmCopiedSecret={confirmCopiedSecret} />
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
