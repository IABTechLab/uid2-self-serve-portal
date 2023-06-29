import { Suspense } from 'react';
import { Await, defer } from 'react-router';

import { User } from '../../api/entities/User';
import { GetAllUsers } from '../services/userAccount';
import AddTeamMemberDialog from './addTeamMemberDialog';
import { PortalRoute } from './routeUtils';

function TeamMembersAndContacts() {
  const;
  return (
    <div className='portal-team'>
      <h1>Team Members & Contacts</h1>
      <p className='heading-details'>
        View current team members below and add additional team members to access Unified ID Portal.
      </p>
    </div>
  );
}

export const TeamMembersAndContactsRoute: PortalRoute = {
  description: 'Team Members & Contacts',
  element: <TeamMembersAndContacts />,
  path: '/dashboard/team',
  loader: () => {
    const users = GetAllUsers();
    return defer({ users });
  },
};
