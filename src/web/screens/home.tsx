import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { CurrentUserContext } from '../contexts/CurrentUserProvider';
import { PortalRoute } from './routeUtils';

import './home.scss';

function SharingPermissionCard() {
  return (
    <div className='sharing-permission-card'>
      <h2>Your Sharing Permissions</h2>
      <span>Participants you&apos;re sharing with to decrypt your encrypted UID2s. </span>
      <div className='permissions-count-section'>
        <div className='permissions-count'>105</div>
        <span>TOTAL PERMISSIONS</span>
      </div>

      <Link to='/dashboard/sharing'>
        <button className='primary-button small-button' type='button'>
          View & Add Sharing Permissions
        </button>
      </Link>
    </div>
  );
}

function DocumentationCard() {
  return (
    <div className='document-card'>
      <img src='/document.svg' alt='document' />
      <div>
        <h2>Documentation</h2>
        <span>Check out documentation for implementation resources</span>
        <a
          href='https://unifiedid.com/docs/overviews/overview-publishers'
          target='_blank'
          rel='noreferrer'
        >
          Publishers
        </a>
        <a
          href='https://unifiedid.com/docs/overviews/overview-advertisers'
          target='_blank'
          rel='noreferrer'
        >
          Advertisers
        </a>
        <a
          href='https://unifiedid.com/docs/overviews/overview-dsps'
          target='_blank'
          rel='noreferrer'
        >
          DSPs
        </a>
        <a
          href='https://unifiedid.com/docs/overviews/overview-data-providers'
          target='_blank'
          rel='noreferrer'
        >
          Data Providers
        </a>
      </div>
    </div>
  );
}

function Home() {
  const { LoggedInUser } = useContext(CurrentUserContext);

  return (
    <>
      <h1>Welcome back, {LoggedInUser?.profile.firstName}</h1>
      <div className='dashboard-cards-container'>
        <SharingPermissionCard />
        <DocumentationCard />
      </div>
    </>
  );
}
export const HomeRoute: PortalRoute = {
  path: '/',
  description: 'Home',
  element: <Home />,
};
