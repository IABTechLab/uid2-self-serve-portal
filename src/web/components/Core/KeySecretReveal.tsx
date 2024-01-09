import { useEffect, useState } from 'react';

import Popover from './Popover';
import { StatusPopup } from './StatusPopup';

import './KeySecretReveal.scss';

const MAX_SHOWN_VALUE_LENGTH = 20;

function ViewSecretButton({
  value,
  title,
  confirmCopiedSecret,
}: {
  value: string;
  title: string;
  confirmCopiedSecret: () => void;
}) {
  const display =
    value.length > MAX_SHOWN_VALUE_LENGTH
      ? `${value.substring(0, MAX_SHOWN_VALUE_LENGTH / 2)}......${value.substring(
          value.length - MAX_SHOWN_VALUE_LENGTH / 2,
          value.length
        )}`
      : value;

  return (
    <>
      {display}
      {value.length > MAX_SHOWN_VALUE_LENGTH && (
        <>
          <Popover
            triggerButton={
              <button
                className='icon-button show-button'
                aria-label={title}
                type='button'
                title={`View ${title}`}
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
  valueName,
  setCopiedSecrets,
}: {
  value: string;
  valueName: string;
  setCopiedSecrets?: React.Dispatch<React.SetStateAction<Map<String, boolean>>>;
}) {
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);

  useEffect(() => {
    if (setCopiedSecrets) {
      setCopiedSecrets((prevMap) => {
        if (!prevMap.has(value)) prevMap.set(value, false);
        return prevMap;
      });
    }
  }, [setCopiedSecrets, value]);

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
      <ViewSecretButton value={value} title={valueName} confirmCopiedSecret={confirmCopiedSecret} />
      <button
        className='icon-button copy-button'
        aria-label='copy'
        type='button'
        onClick={() => copyKey()}
        title={`Copy ${valueName} to clipboard`}
      >
        Copy
      </button>
      {showStatusPopup && (
        <StatusPopup
          status='Success'
          show={showStatusPopup}
          setShow={setShowStatusPopup}
          message={`${valueName} copied to clipboard.`}
        />
      )}
    </div>
  );
}

export default KeySecretReveal;
