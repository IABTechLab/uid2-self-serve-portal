import { useState } from 'react';

import Popover from './Popover';
import { StatusPopup } from './StatusPopup';

import './DisplaySecret.scss';

const MAX_SHOWN_VALUE_LENGTH = 20;

export type Secret = {
  value: string;
  valueName: string;
};

function CopyKeyButton({
  secret,
  setShowStatusPopup,
}: {
  secret: Secret;
  setShowStatusPopup: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const copyKey = (): void => {
    setShowStatusPopup(true);
    navigator.clipboard.writeText(secret.value);
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

function DisplaySecret({ secret }: { secret: Secret }) {
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);

  const [showPopover, setShowPopover] = useState<boolean>(false);

  return (
    <div className='display-secret'>
      <p>{secret.value}</p>
      <CopyKeyButton secret={secret} setShowStatusPopup={setShowStatusPopup} />
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
export default DisplaySecret;
