import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import log from 'loglevel';
import { Suspense, useCallback, useState } from 'react';
import { Await, defer, useLoaderData, useRevalidator } from 'react-router-dom';

import { User } from '../../api/entities/User';
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
  const [reinviteState, setInviteState] = useState<InviteState>(InviteState.initial);
  const resendInvite = useCallback(async () => {
    if (reinviteState !== InviteState.initial) {
      log.error(`Unexpected click event on reinvite button`);
      return;
    }

    setInviteState(InviteState.inProgress);
    try {
      await ResendInvite(person.id);
      setInviteState(InviteState.sent);
    } catch {
      setInviteState(InviteState.error);
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
      <p className='heading-details'>
        View current team members below and add additional team members to access Unified ID Portal.
      </p>
      <h2>Team Members</h2>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.users}>
          {(users: User[]) => (
            <>
              <table className='portal-team-table'>
                <thead>
                  <tr>
                    <th className='name'>Name</th>
                    <th className='email'>Email</th>
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
  description: 'Team Members',
  element: <TeamMembers />,
  path: '/dashboard/team',
  loader: () => {
    const users = GetAllUsers();
    return defer({ users });
  },
};
