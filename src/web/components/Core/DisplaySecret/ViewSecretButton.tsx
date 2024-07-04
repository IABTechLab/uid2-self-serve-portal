import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Popover from '../Popups/Popover';
import { Secret } from './CopySecretButton';

type ViewSecretButtonProps = Readonly<{
  secret: Secret;
}>;

export function ViewSecretButton({ secret }: ViewSecretButtonProps) {
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
