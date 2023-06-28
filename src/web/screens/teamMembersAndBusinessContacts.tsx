import * as Tabs from '@radix-ui/react-tabs';
import { defer } from 'react-router-dom';

import { GetAllUsers } from '../services/userAccount';
import { BusinessContacts } from './businessContacts';
import { PortalRoute } from './routeUtils';
import { TeamMembers } from './teamMembers';

import './teamMembersAndBusinessContacts.scss';

function TeamMembersAndBusinessContacts() {
  return (
    <div className='portal-team'>
      <h1>Team Members & Contacts</h1>
      <p className='heading-details'>
        View current team members below and add additional team members to access Unified ID Portal.
      </p>
      <Tabs.Root defaultValue='teamMembers'>
        <Tabs.List className='TabsList'>
          <Tabs.Trigger className='TabsTrigger' value='teamMembers'>
            <h2>Team Members</h2>
          </Tabs.Trigger>
          <Tabs.Trigger className='TabsTrigger' value='businessContacts'>
            <h2>Email Contacts</h2>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value='teamMembers'>
          <TeamMembers />
        </Tabs.Content>
        <Tabs.Content value='businessContacts'>
          <BusinessContacts />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

export const TeamMembersAndBusinessContactsRoute: PortalRoute = {
  description: 'Team Members & Contacts',
  element: <TeamMembersAndBusinessContacts />,
  path: '/dashboard/team',
  loader: () => {
    const users = GetAllUsers();
    return defer({ users });
  },
};
