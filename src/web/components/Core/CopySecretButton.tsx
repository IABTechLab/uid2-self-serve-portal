import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SuccessToast } from './Toast';

import './CopySecretButton.scss';

export type Secret = Readonly<{
  value: string;
  valueName: string;
}>;

function CopyKeyButton({ secret }: { secret: Secret }) {
  const copyKey = (): void => {
    SuccessToast(`${secret.valueName} copied to clipboard.`);
    navigator.clipboard.writeText(secret.value);
  };

  return (
    <div className='copy-secret-button'>
      <button
        className='copy-button icon-button'
        aria-label='copy'
        type='button'
        onClick={() => copyKey()}
        title={`Copy ${secret.valueName.toLowerCase()} to clipboard.`}
      >
        <FontAwesomeIcon icon='copy' />
      </button>
    </div>
  );
}

export default CopyKeyButton;
