import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './CopySecretButton.scss';

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
    <div className='copy-secret-button'>
      <button
        className='copy-button icon-button'
        aria-label='copy'
        type='button'
        onClick={() => copyKey()}
        title={`Copy ${secret.valueName} to clipboard`}
      >
        <FontAwesomeIcon icon='copy' />
      </button>
    </div>
  );
}

export default CopyKeyButton;
