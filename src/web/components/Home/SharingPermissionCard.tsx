import { Link } from 'react-router-dom';

import { Card } from '../Core/Card';

import './SharingPermissionCard.scss';

type SharingPermissionCardProps = Readonly<{
  sharingPermissionsCount?: number;
  bulkPermissionsCount?: number;
}>;

function SharingPermissionCard({
  sharingPermissionsCount,
  bulkPermissionsCount,
}: SharingPermissionCardProps) {
  return (
    <Card>
      <h2>Your Sharing Permissions</h2>
      <span>Participants you&apos;re sharing with to decrypt your encrypted UID2s. </span>
      <div className='permissions-count-section'>
        <div>
          <div className='permissions-count'>{sharingPermissionsCount}</div>
          <span>MANUAL PERMISSIONS</span>
        </div>
        <div className='divider' />
        <div>
          <div className='permissions-count'>{bulkPermissionsCount}</div>
          <span>AUTOMATIC PERMISSIONS</span>
        </div>
      </div>
      <Link to='/dashboard/sharing'>
        <button className='primary-button small-button' type='button'>
          View & Add Sharing Permissions
        </button>
      </Link>
    </Card>
  );
}

export default SharingPermissionCard;
