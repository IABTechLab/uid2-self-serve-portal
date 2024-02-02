import { useState } from 'react';

import CopyKeyButton, { Secret } from './CopySecretButton';
import { StatusPopup } from './StatusPopup';

import './DisplaySecret.scss';

function DisplaySecret({ secret }: { secret: Secret }) {
  const [showStatusPopup, setShowStatusPopup] = useState<boolean>(false);

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
