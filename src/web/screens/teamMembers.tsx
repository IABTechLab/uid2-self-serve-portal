import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Suspense, useCallback, useState } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import { User } from '../../api/entities/User';
import { GetAllUsers } from '../services/userAccount';
import AddTeamMemberDialog from './addTeamMemberDialog';
import { PortalRoute } from './routeUtils';

import './teamMembers.scss';

type TeamMemberProps = { person: User };

function TeamMember({ person }: TeamMemberProps) {
  const [editMode, setEditMode] = useState(false);
  return (
    <tr className='member-view'>
      <td>{`${person.firstName} ${person.lastName}`}</td>
      <td>{person.email}</td>
      <td>Admin</td>
      <td className='action'>
        <button type='button'>
          <FontAwesomeIcon icon='pencil' onClick={() => setEditMode(true)} />
        </button>
        <button type='button' className='delete'>
          <FontAwesomeIcon icon='trash-can' />
        </button>
      </td>
    </tr>
  );
}

function Loading() {
  return <div>Loading team data...</div>;
}

function TeamMembers() {
  const data = useLoaderData() as { users: User[] };
  const reloader = useRevalidator();
  const onAddTeamMember = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);
  return (
    <div className='portal-team'>
      <h1>Team Members & Contacts</h1>
      <p>View current team members below and add additional team members to access UID Portal.</p>
      <h2>Current Team Members</h2>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.users}>
          {(users: User[]) => (
            <>
              <table className='portal-team-table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Job Function</th>
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
                <AddTeamMemberDialog onAddTeamMember={onAddTeamMember} />
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
  path: '/dashboard/team',
  loader: () => {
    const users = GetAllUsers();
    return defer({ users });
  },
};
