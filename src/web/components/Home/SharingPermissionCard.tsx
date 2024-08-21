import { Link } from 'react-router-dom';

import { Banner } from '../Core/Banner/Banner';
import { Card } from '../Core/Card/Card';

import './SharingPermissionCard.scss';

type SharingPermissionCardProps = Readonly<{
  sharingPermissionsCount?: number;
  bulkPermissionsCount?: number;
  hasKeyset: boolean;
}>;

function SharingPermissionCard({
  sharingPermissionsCount,
  bulkPermissionsCount,
  hasKeyset,
}: SharingPermissionCardProps) {
  return (
    <Card>
      <h2>Your Sharing Permissions</h2>
      <span>Participants you&apos;re sharing with to decrypt your encrypted UID2s. </span>
      {hasKeyset ? (
        <>
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
          <Link to='../sharing' relative='path'>
            <button className='primary-button small-button' type='button'>
              View & Add Sharing Permissions
            </button>
          </Link>
        </>
      ) : (
        <div className='no-sharing-permissions-banner'>
          <Banner
            message='You do not have access to this feature. To get access, please contact Support.'
            type='Info'
            fitContent
          />
        </div>
      )}
    </Card>
  );
}

export default SharingPermissionCard;
