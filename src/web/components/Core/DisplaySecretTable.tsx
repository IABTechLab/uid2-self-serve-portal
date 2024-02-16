import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CopyKeyButton, { Secret } from './CopySecretButton';
import Popover from './Popover';

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
      <CopyKeyButton secret={secret} />
    </div>
  );
}
export default DisplaySecretTable;
