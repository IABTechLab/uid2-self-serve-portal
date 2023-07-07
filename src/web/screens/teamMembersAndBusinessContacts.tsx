import * as Tabs from '@radix-ui/react-tabs';
import { defer, useNavigate } from 'react-router-dom';

import { GetEmailContacts } from '../services/participant';
import { GetAllUsers } from '../services/userAccount';
import { BusinessContacts } from './businessContacts';
import { PortalRoute } from './routeUtils';
import { TeamMembers } from './teamMembers';

import './teamMembersAndBusinessContacts.scss';

function TeamMembersAndBusinessContacts() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/dashboard/sharing');
  };

  return (
    <div className='portal-team-and-business-contacts'>
      <h1>Team Members & Contacts</h1>
      <p className='heading-details'>
        View current team members below and add additional team members to access Unified ID Portal.
      </p>
      <Tabs.Root defaultValue='teamMembers'>
        <Tabs.List className='tabs-list'>
          <Tabs.Trigger className='tabs-trigger' value='teamMembers'>
            Team Members
          </Tabs.Trigger>
          <Tabs.Trigger className='tabs-trigger' value='businessContacts'>
            Email Contacts
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='teamMembers'>
          <TeamMembers />
        </Tabs.Content>
        <Tabs.Content value='businessContacts'>
          <BusinessContacts />
        </Tabs.Content>
      </Tabs.Root>
      <div className='dashboard-footer'>
        <div>
          <button className='small-button primary-button' onClick={handleNext} type='button'>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export const TeamMembersAndBusinessContactsRoute: PortalRoute = {
  description: 'Team Members & Contacts',
  element: <TeamMembersAndBusinessContacts />,
  path: '/dashboard/team',
  loader: () => {
    const users = GetAllUsers();
    const emailContacts = GetEmailContacts();
    return defer({ users, emailContacts });
  },
};
