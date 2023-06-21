import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { Suspense, useCallback, useContext, useState } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import { User } from '../../api/entities/User';
import { ParticipantContext } from '../contexts/ParticipantProvider';
import { GetAllUsers, ResendInvite } from '../services/userAccount';
import AddTeamMemberDialog from './addTeamMemberDialog';
import { PortalRoute } from './routeUtils';

import './teamMembers.scss';

type TeamMemberProps = { person: User };

enum InviteState {
  initial,
  inProgress,
  sent,
  error,
}
function TeamMember({ person }: TeamMemberProps) {
  const { participant } = useContext(ParticipantContext);
  const [reinviteState, setInviteState] = useState<InviteState>(InviteState.initial);
  const resendInvite = useCallback(async () => {
    switch (reinviteState) {
      case InviteState.initial:
        setInviteState(InviteState.inProgress);
        ResendInvite(person.id).then((success) => {
          if (success) {
            setInviteState(InviteState.sent);
          } else {
            setInviteState(InviteState.error);
          }
        });
        break;
    }
  }, [person, reinviteState]);
  return (
    <tr>
      <td>{`${person.firstName} ${person.lastName}`}</td>
      <td>{person.email}</td>
      <td className='action'>
        {person.acceptedTerms || (
          <button
            type='button'
            className={clsx({
              clickable: reinviteState === InviteState.initial,
              error: reinviteState === InviteState.error,
            })}
            onClick={() => resendInvite()}
          >
            {reinviteState === InviteState.initial && 'Resend Invitation'}
            {reinviteState === InviteState.inProgress && 'Sending...'}
            {reinviteState === InviteState.sent && 'Invitation Sent'}
            {reinviteState === InviteState.error && 'Try again later'}
          </button>
        )}
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
  const data = useLoaderData() as { users: User[] };
  const reloader = useRevalidator();
  const onAddTeamMember = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);
  return (
    <div className='portal-team'>
      <h1>Team Members & Contacts</h1>
      <p className='heading-details'>Manage access to this participant account.</p>
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
