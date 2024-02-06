import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import CopyKeyButton, { Secret } from './CopySecretButton';
import Popover from './Popover';
import { StatusPopup } from './StatusPopup';

import './DisplaySecretTable.scss';

const MAX_SHOWN_VALUE_LENGTH = 20;

function ViewSecretButton({ secret }: { secret: Secret }) {
  return (
    <Popover
      triggerButton={
        <button
          className='icon-button view-button'
          aria-label={secret.valueName}
          type='button'
          title={`View ${secret.valueName}`}
        >
          <FontAwesomeIcon icon='eye' />
        </button>
      }
    >
      <p>{secret.value}</p>
    </Popover>
  );
}

function DisplaySecretTable({ secret }: { secret: Secret }) {
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);

  const secretText =
    secret.value.length > MAX_SHOWN_VALUE_LENGTH
      ? `${secret.value.substring(0, MAX_SHOWN_VALUE_LENGTH / 2)}......${secret.value.substring(
          secret.value.length - MAX_SHOWN_VALUE_LENGTH / 2,
          secret.value.length
        )}`
      : secret.value;

  return (
    <div className='display-secret-table'>
      {secretText}
      {secret.value.length > MAX_SHOWN_VALUE_LENGTH && (
        <>
          <ViewSecretButton secret={secret} />|
        </>
      )}
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
export default DisplaySecretTable;
