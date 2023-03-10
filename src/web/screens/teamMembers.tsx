import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Suspense } from 'react';
import { Await, defer, useLoaderData } from 'react-router-dom';

import { GetAllUsers, UserAccount } from '../services/userAccount';
import { PortalRoute } from './routeTypes';

import './teamMembers.scss';

type TeamMemberProps = { person: UserAccount };
function TeamMember({ person }: TeamMemberProps) {
  return (
    <tr>
      <td>{person.name}</td>
      <td>{person.location}</td>
      <td>{person.email}</td>
      <td>Admin</td>
      <td className='action'>
        <FontAwesomeIcon icon='pencil' />
        <FontAwesomeIcon icon='trash-can' />
      </td>
    </tr>
  );
}

function Loading() {
  return <div>Loading team data...</div>;
}

function TeamMembers() {
  const data = useLoaderData() as { users: UserAccount[] };
  return (
    <div className='portal-team'>
      <h1>Team Members & Contacts</h1>
      <p>View current team members below and add additional team members to access UID Portal.</p>
      <h2>Current Team Members</h2>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.users}>
          {(users: UserAccount[]) => (
            <>
              <table className='portal-team-table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className='action'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((t) => (
                    <TeamMember key={t.email} person={t} />
                  ))}
                </tbody>
              </table>
              <div className='add-team-member'>
                <button type='button' className='add-team-member'>
                  <span>Add team member</span>
                </button>
              </div>
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

export const TeamMembersRoute: PortalRoute = {
  description: 'Team Members & Contacts',
  element: <TeamMembers />,
  path: '/team',
  loader: () => {},
  curriedLoader: (apiClient) => () => {
    const users = GetAllUsers(apiClient);
    return defer({ users });
  },
};
