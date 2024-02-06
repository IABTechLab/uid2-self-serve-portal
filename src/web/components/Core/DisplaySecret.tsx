import CopyKeyButton, { Secret } from './CopySecretButton';

import './DisplaySecret.scss';

function DisplaySecret({ secret }: { secret: Secret }) {
  return (
    <div className='display-secret'>
      <p>{secret.value}</p>
      <CopyKeyButton secret={secret} />
    </div>
  );
}
export default DisplaySecret;
