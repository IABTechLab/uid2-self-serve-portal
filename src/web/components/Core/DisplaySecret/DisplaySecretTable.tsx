import CopyKeyButton, { Secret } from './CopySecretButton';
import { ViewSecretButton } from './ViewSecretButton';

import './DisplaySecretTable.scss';

const MAX_SHOWN_VALUE_LENGTH = 20;

type DisplaySecretTableProps = Readonly<{
  secret: Secret;
}>;

function DisplaySecretTable({ secret }: DisplaySecretTableProps) {
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
