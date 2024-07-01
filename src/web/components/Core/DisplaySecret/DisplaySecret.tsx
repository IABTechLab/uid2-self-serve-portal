import CopyKeyButton, { Secret } from '../Buttons/CopySecretButton';

import './DisplaySecret.scss';

type DisplaySecretProps = Readonly<{
  secret: Secret;
}>;

function DisplaySecret({ secret }: DisplaySecretProps) {
  return (
    <div className='display-secret'>
      <p>{secret.value}</p>
      <CopyKeyButton secret={secret} />
    </div>
  );
}
export default DisplaySecret;
