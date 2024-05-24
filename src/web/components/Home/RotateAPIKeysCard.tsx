import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import { ApiKeyDTO } from '../../../api/services/adminServiceHelpers';
import {
  deduplicateStrings,
  formatStringsWithSeparator,
  formatUnixDate,
} from '../../utils/textHelpers';

import './RotateAPIKeysCard.scss';

type RotateApiKeysCardProps = Readonly<{
  apiKeysToRotate: ApiKeyDTO[];
}>;

function RotateApiKeysCard({ apiKeysToRotate }: RotateApiKeysCardProps) {
  const getDatesCreated = () => {
    const datesCreated = apiKeysToRotate.map((apiKey) => formatUnixDate(apiKey.created).toString());
    const datesCreatedString = formatStringsWithSeparator(deduplicateStrings(datesCreated));
    return datesCreatedString;
  };

  console.log(apiKeysToRotate);

  return (
    <div className='rotate-api-keys-card'>
      <FontAwesomeIcon icon='triangle-exclamation' className='warning-button' />
      <h2>Rotate Your API Key{apiKeysToRotate.length > 1 && 's'}</h2>
      <div className='rotate-api-keys-text'>
        <span>
          {`Your API key${
            apiKeysToRotate.length > 1 ? 's were' : ' was'
          } created on ${getDatesCreated()}. We recommend you rotate your API key${
            apiKeysToRotate.length > 1 ? 's' : ''
          } every year.`}{' '}
        </span>
      </div>

      <Link to='/dashboard/apiKeys'>
        <button className='primary-button small-button' type='button'>
          Rotate API Key{apiKeysToRotate.length > 1 && 's'}
        </button>
      </Link>
    </div>
  );
}

export default RotateApiKeysCard;
