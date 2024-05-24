import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import './RotateAPIKeysCard.scss';

type RotateApiKeysCardProps = Readonly<{
  dateCreated: string;
}>;

function RotateApiKeysCard({ dateCreated }: RotateApiKeysCardProps) {
  return (
    <div className='sharing-permission-card'>
      <FontAwesomeIcon icon='triangle-exclamation' className='warning-button' />
      <h2>Rotate Your API Key</h2>
      <div>
        <span>
          {`Your API Key was created on ${dateCreated}. We recommend you rotate your API key every year because of 'x'.`}{' '}
        </span>
      </div>

      <Link to='/dashboard/apiKeys'>
        <button className='primary-button small-button' type='button'>
          Rotate API Key
        </button>
      </Link>
    </div>
  );
}

export default RotateApiKeysCard;
