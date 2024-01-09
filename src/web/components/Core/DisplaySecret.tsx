import { useState } from 'react';

import Popover from './Popover';
import { StatusPopup } from './StatusPopup';

import './DisplaySecret.scss';

const MAX_SHOWN_VALUE_LENGTH = 20;

export type Secret = {
  value: string;
  valueName: string;
};

function ViewSecretButton({ secret, onCopy }: { secret: Secret; onCopy: () => void }) {
  const display =
    secret.value.length > MAX_SHOWN_VALUE_LENGTH
      ? `${secret.value.substring(0, MAX_SHOWN_VALUE_LENGTH / 2)}......${secret.value.substring(
          secret.value.length - MAX_SHOWN_VALUE_LENGTH / 2,
          secret.value.length
        )}`
      : secret.value;

  return (
    <>
      {display}
      {secret.value.length > MAX_SHOWN_VALUE_LENGTH && (
        <Popover
          triggerButton={
            <button
              className='icon-button show-button'
              aria-label={secret.valueName}
              type='button'
              title={`View ${secret.valueName}`}
              onClick={onCopy}
            >
              View
            </button>
          }
        >
          <p>{secret.value}</p>
        </Popover>
      )}
    </>
  );
}

export default DisplaySecret;
function CopyKeyButton({
  secret,
  onCopy,
  setShowStatusPopup,
}: {
  secret: Secret;
  onCopy: () => void;
  setShowStatusPopup: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const copyKey = (): void => {
    setShowStatusPopup(true);
    navigator.clipboard.writeText(secret.value);
    onCopy();
  };

  return (
    <button
      className='icon-button copy-button'
      aria-label='copy'
      type='button'
      onClick={() => copyKey()}
      title={`Copy ${secret.valueName} to clipboard`}
    >
      Copy
    </button>
  );
}

function DisplaySecret({ secret, onCopy = () => {} }: { secret: Secret; onCopy?: () => void }) {
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);

  return (
    <div className='key-secret-reveal'>
      <ViewSecretButton secret={secret} onCopy={onCopy} />|
      <CopyKeyButton onCopy={onCopy} secret={secret} setShowStatusPopup={setShowStatusPopup} />
      {showStatusPopup && (
        <StatusPopup
          status='Success'
          show={showStatusPopup}
          setShow={setShowStatusPopup}
          message={`${secret.valueName} copied to clipboard.`}
        />
      )}
    </div>
  );
}
