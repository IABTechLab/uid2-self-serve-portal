import { Link } from 'react-router-dom';

import './SharingPermissionCard.scss';

type SharingPermissionCardProps = {
  sharingPermissionsCount?: number;
  error?: unknown;
};

function SharingPermissionCard({ sharingPermissionsCount, error }: SharingPermissionCardProps) {
  return (
    <div className='sharing-permission-card'>
      <h2>Your Sharing Permissions</h2>
      <span>Participants you&apos;re sharing with to decrypt your encrypted UID2s. </span>
      <div className='permissions-count-section'>
        {error ? (
          <p className='error'>Uh Oh, something went wrong! </p>
        ) : (
          <div>
            <div className='permissions-count'>{sharingPermissionsCount}</div>
            <span>TOTAL PERMISSIONS</span>{' '}
          </div>
        )}
        <div className='divider' />
      </div>
      <Link to='/dashboard/sharing'>
        <button className='primary-button small-button' type='button'>
          View & Add Sharing Permissions
        </button>
      </Link>
    </div>
  );
}

export default SharingPermissionCard;
