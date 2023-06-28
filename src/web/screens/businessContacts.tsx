import { Suspense, useCallback } from 'react';
import { Await, useLoaderData, useRevalidator } from 'react-router-dom';

import { User } from '../../api/entities/User';
import AddTeamMemberDialog from './addTeamMemberDialog';

function Loading() {
  return <div>Loading business contacts...</div>;
}

export function BusinessContacts() {
  const data = useLoaderData() as { users: User[] };
  const reloader = useRevalidator();
  const onAddTeamMember = useCallback(() => {
    reloader.revalidate();
  }, [reloader]);
  return (
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
              <tbody />
            </table>
            <div className='add-team-member'>
              <AddTeamMemberDialog onAddTeamMember={onAddTeamMember} />
            </div>
          </>
        )}
      </Await>
    </Suspense>
  );
}
