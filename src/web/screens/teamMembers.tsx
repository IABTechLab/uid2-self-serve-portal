import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Suspense } from 'react';
import { Await, defer, useLoaderData } from 'react-router-dom';

import { GetAllUsers, UserAccount } from '../services/userAccount';
import { PortalRoute } from './routeTypes';

import './teamMembers.scss';

type TeamMemberProps = { person: UserAccount };
function TeamMember({ person }: TeamMemberProps) {
  return (
    <>
      <div className='name'>{person.name}</div>
      <div className='location'>{person.location}</div>
      <div className='email'>{person.email}</div>
      <div className='action'>
        <FontAwesomeIcon icon='ellipsis-h' />
      </div>
    </>
  );
}

function Loading() {
  return <div>Loading team data...</div>;
}

function TeamMembers() {
  const data = useLoaderData() as { users: UserAccount[] };
  return (
    <div className='portal-team'>
      <div className='add-team-member'>
        <span>+ Add team member</span>
      </div>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.users}>
          {(users: UserAccount[]) => (
            <div className='portal-team-table'>
              <div className='name header-item'>Team Member</div>
              <div className='location header-item'>Location</div>
              <div className='email header-item'>Email</div>
              <div className='action header-item'>Action</div>
              {users.map((t) => (
                <TeamMember key={t.email} person={t} />
              ))}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

export const TeamMembersRoute: PortalRoute = {
  description: 'Team Members',
  element: <TeamMembers />,
  path: '/team',
  loader: () => {},
  curriedLoader: (apiClient) => () => {
    const users = GetAllUsers(apiClient);
    return defer({ users });
  },
};
